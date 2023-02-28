import { toSlug } from '@common/helpers/string.helper';
import { Chain, ChainDocument } from '@modules/chains/coin.shema';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Model, PipelineStage } from 'mongoose';
import {
  PromotedList,
  PromotedListDocument,
} from '../promoted-list/promoted-list.shema';
import { STATUS } from './coin.enum';
import { Coin, CoinDocument } from './coin.shema';
import { CreateCoinDto } from './dtos/create-coin.dto';
import { FilterCoinDto } from './dtos/filter-coin.dto';
import { ResponseCoinDto } from './dtos/response-coin.dto';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(Coin.name) private coinModel: Model<CoinDocument>,
    @InjectModel(Chain.name) private chainModel: Model<ChainDocument>,
    @InjectModel(PromotedList.name)
    private promotedModel: Model<PromotedListDocument>,
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

    if (chainId) {
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
      const promoted = await this.promotedModel.find(
        {
          startTime: { $lte: now },
          expiredTime: { $gte: now },
        },
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
    const chains = await this.chainModel.find();
    const objChains = chains.reduce((acc, cur) => {
      {
        if (!acc?.[cur?.scanValue]) {
          acc[cur?.scanValue] = cur;
        }
        return acc;
      }
    }, {});
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
      data: resultCoins.map((item) => plainToInstance(ResponseCoinDto, item)),
    };
  }

  async getCoinBySlug(slug) {
    const coins = await this.coinModel.aggregate([
      { $match: { slug } },
      { $limit: 1 },
    ]);
    const coin = coins?.[0] ? coins[0] : null;

    // add chain info to coin result
    const chains = await this.chainModel.find();
    const objChains = chains.reduce((acc, cur) => {
      {
        if (!acc?.[cur?.scanValue]) {
          acc[cur?.scanValue] = cur;
        }
        return acc;
      }
    }, {});

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

  async updateCoinLogoBySlug(slug: string, file: Express.Multer.File) {
    console.log(file);
    const coin = await this.coinModel.findOne({ slug });
    return { data: coin };
  }

  async upVote(slug) {
    await this.coinModel.updateOne({ slug }, { $inc: { totalVotes: 1 } });
    return { result: 'success' };
  }

  async approveCoin(slug) {
    const coin = await this.coinModel.findOne({ slug });

    coin.status = STATUS.APPROVED;
    coin.approvedAt = new Date();
    await coin.save();
    // Object.assign(coin, { status: STATUS.APPROVED });

    return { data: coin };
  }
}
