import { toSlug } from '@common/helpers/string.helper';
import { RECAPTCHA_SECRET_KEY } from '@configs/app';
import { ChainService } from '@modules/chains/chains.service';
import {
  PromoteCoin,
  PromoteCoinDocument,
} from '@modules/promote-coin/promote-coin.shema';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model, PipelineStage } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import { STATUS } from './coin.enum';
import { Coin, CoinDocument } from './coin.shema';
import { CreateCoinDto } from './dtos/create-coin.dto';
import { FilterCoinDto } from './dtos/filter-coin.dto';
import { ResponseCoinDto } from './dtos/response-coin.dto';
import { UpdateCoinDto } from './dtos/update-coin.dto';
import { VoteCoinDto } from './dtos/vote-coin.dto';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(Coin.name) private coinModel: Model<CoinDocument>,
    @InjectModel(PromoteCoin.name)
    private promoteCoinModel: Model<PromoteCoinDocument>,
    private chainService: ChainService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(filter: FilterCoinDto) {
    const {
      chainId,
      approved,
      promoted,
      search = '',
      sortBy = 'createdAt',
      sortDirection = 'desc',
      page = 1,
      pageSize = 10,
    } = filter;

    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $addFields: {
        change1h: { $toDouble: '$change1h' },
        change6h: { $toDouble: '$change6h' },
        change24h: { $toDouble: '$change24h' },
        liquidityUsdNumber: { $toDouble: '$liquidityUsd' },
        volume24hNumber: { $toDouble: '$volume24h' },
      },
    });

    pipeline.push({
      $addFields: {
        trending: {
          $cond: [
            {
              $or: [
                { $eq: ['$liquidityUsdNumber', 0] },
                { $eq: ['$liquidityUsdNumber', null] },
                { $eq: ['$volume24hNumber', 0] },
                { $eq: ['$volume24hNumber', null] },
              ],
            },
            0,
            { $divide: ['$volume24hNumber', '$liquidityUsdNumber'] },
          ],
        },
      },
    });

    pipeline.push({ $unset: ['volume24hNumber', 'liquidityUsdNumber'] });

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'gi' } },
            { symbol: { $regex: search, $options: 'gi' } },
            { contractAddress: { $regex: search, $options: 'gi' } },
          ],
        },
      });
    }

    if (chainId && chainId !== -1) {
      pipeline.push({
        $match: { chains: { $elemMatch: { chainId: +chainId } } },
      });
    }

    if (approved === 'false') {
      pipeline.push({ $match: { approvedAt: null } });
    }

    if (approved === 'true') {
      pipeline.push({ $match: { approvedAt: { $ne: null } } });
    }

    if (promoted === 'true') {
      const now = new Date().toISOString();
      const promoted = await this.promoteCoinModel.find(
        { expiredAt: { $gte: now } },
        { coin: 1 },
      );
      pipeline.push({
        $match: { _id: { $in: promoted?.map((item) => item?.coin) } },
      });
    }

    const countAggregate = await this.coinModel.aggregate([
      ...pipeline,
      { $count: 'count' },
    ]);
    const count = countAggregate?.[0]?.count || 0;

    pipeline.push({
      $sort: { [sortBy]: sortDirection.toLowerCase() === 'asc' ? 1 : -1 },
    });
    pipeline.push({ $skip: (page - 1) * pageSize });
    pipeline.push({ $limit: +pageSize });

    const coins = await this.coinModel.aggregate(pipeline);

    // add chain info to coins result
    const objChains = await this.chainService.getObjectByChainId();

    const resultCoins = coins.map((item) => ({
      ...item,
      chains: item?.chains.map((chain) => ({
        ...chain,
        chain: objChains[chain.chainId],
      })),
    }));

    return {
      currentPage: +page,
      totalPage: Math.ceil(count / pageSize),
      totalItem: count,
      data: resultCoins.map((item) => plainToClass(ResponseCoinDto, item)),
    };
  }

  async getTrendingCoins(filter: FilterCoinDto) {
    const { chainId, search = '', page = 1, pageSize = 10 } = filter;

    const pipeline: PipelineStage[] = [];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'gi' } },
            { symbol: { $regex: search, $options: 'gi' } },
            { contractAddress: { $regex: search, $options: 'gi' } },
          ],
        },
      });
    }

    if (chainId && chainId !== -1) {
      pipeline.push({
        $match: { chains: { $elemMatch: { chainId: +chainId } } },
      });
    }
    pipeline.push({
      $sort: { liquidityUsd: -1 },
    });

    // const trendingCoins = await this.coinModel
    //   .find({ approvedAt: { $ne: null } })
    //   .sort({
    //     change24h: -1,
    //     liquidityUsd: -1,
    //     change6h: -1,
    //     volume24h: -1,
    //   })
    //   .limit(50);

    const coins = await this.coinModel.aggregate(pipeline);
    const validCoins = coins.filter(
      (item) => +item?.volume24h > 0 && +item?.liquidityUsd > 0,
    );
    const sortedCoins = validCoins.sort(
      (a, b) =>
        b.volume24h / (b.liquidityUsd || 1) -
        a.volume24h / (a.liquidityUsd || 1),
    );
    const trendingCoins = sortedCoins.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );

    const objChains = await this.chainService.getObjectByChainId();
    const resultCoins = trendingCoins.map((item) => ({
      ...item,
      chains: item?.chains.map((chain) => ({
        ...chain,
        chain: objChains[chain.chainId],
      })),
    }));

    return {
      currentPage: +page,
      totalPage: Math.ceil(validCoins?.length / pageSize),
      totalItem: validCoins?.length,
      data: resultCoins.map((item) => plainToClass(ResponseCoinDto, item)),
    };
  }

  async getCoinBySlug(slug) {
    const coins = await this.coinModel.aggregate([
      { $match: { slug } },
      { $limit: 1 },
    ]);
    const coin = coins?.[0] ? coins[0] : null;

    // add chain info to coin result
    const objChains = await this.chainService.getObjectByChainId();

    const resultCoin = {
      ...coin,
      chains: coin.chains?.map((chain) => ({
        ...chain,
        chain: objChains[chain.chainId],
      })),
    };

    return { data: plainToClass(ResponseCoinDto, resultCoin) };
  }

  async create(body: CreateCoinDto) {
    // const maxIdCoin = await this.coinRepo
    const maxIdCoin = await this.coinModel.findOne({}).sort({ id: -1 });

    console.log(maxIdCoin);

    body.id = (+maxIdCoin?.id || 0) + 1;
    const slug = toSlug(body?.name);

    let countBySLug = await this.coinModel.count({ slug: slug });

    if (countBySLug > 0) {
      while (true) {
        countBySLug++;
        const isExistBySlug = await this.coinModel.exists({
          slug: slug + '-' + countBySLug,
        });
        if (!isExistBySlug) {
          break;
        }
      }
      body.slug = slug + '-' + countBySLug;
    } else {
      body.slug = slug;
    }

    const coin = await this.coinModel.create(body);

    return { data: coin };
  }

  async update(body: UpdateCoinDto) {
    delete body.id;
    delete body.slug;

    await this.coinModel.updateOne({ _id: body._id }, body);

    return { result: 'success' };
  }

  async updateCoinLogoBySlug(slug: string, file: Express.Multer.File) {
    console.log(file);
    const coin = await this.coinModel.findOne({ slug });
    return { data: coin };
  }

  async deleteCoinBySlug(slug: string) {
    await this.coinModel.deleteOne({ slug: slug });
    return { result: 'success' };
  }

  async upVote(dto: VoteCoinDto) {
    const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${dto.recaptchaToken}`;

    const http = this.httpService.post(VERIFY_URL).pipe(map((res) => res.data));
    const data = await lastValueFrom(http);

    if (!data.success) {
      throw new BadRequestException('Recaptcha token is wrong');
    }

    await this.coinModel.updateOne(
      { slug: dto.slug },
      { $inc: { totalVotes: 1 } },
    );
    return { result: 'success' };
  }

  async approveCoin(slug) {
    const coin = await this.coinModel.findOne({ slug });

    coin.status = STATUS.APPROVED;
    coin.approvedAt = new Date();
    await coin.save();

    return { data: coin };
  }

  async unApproveCoin(slug) {
    const coin = await this.coinModel.findOne({ slug });

    coin.status = STATUS.APPROVING;
    coin.approvedAt = null;
    await coin.save();

    return { data: coin };
  }
}
