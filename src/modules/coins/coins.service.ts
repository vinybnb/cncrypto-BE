import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { lastValueFrom, map } from 'rxjs';
import { Repository, ILike } from 'typeorm';
import { STATUS } from './coin.enum';
import { Coin, CoinDocument } from './coin.shema';
import {
  PromotedList,
  PromotedListDocument,
} from '../promoted-list/promoted-list.shema';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { Chain } from '@modules/chains/coin.shema';
import { CreateCoinDto } from './dtos/create-coin.dto';
import { toSlug } from '@common/helpers/string.helper';
import { FilterCoinDto } from './dtos/filter-coin.dto';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(Coin.name) private coinModel: Model<CoinDocument>,
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
      pipeline.push({ $match: { chainId: chainId } });
    }

    if (approved === 'false') {
      pipeline.push({ $match: { approvedAt: null } });
    }

    if (approved === 'true') {
      pipeline.push({ $match: { approvedAt: { $ne: null } } });
    }

    const countAggregate = await this.coinModel.aggregate([
      ...pipeline,
      { $count: 'count' },
    ]);
    const count = countAggregate?.[0]?.count;

    pipeline.push({
      $sort: { [sortBy]: sortDirection.toLowerCase() === 'asc' ? 1 : -1 },
    });
    pipeline.push({ $skip: (page - 1) * pageSize });
    pipeline.push({ $limit: +pageSize });
    pipeline.push({
      $lookup: {
        from: 'chains',
        localField: 'chainId',
        foreignField: 'scanValue',
        as: 'chain',
      },
    });
    pipeline.push({ $addFields: { chain: { $arrayElemAt: ['$chain', 0] } } });

    const coins = await this.coinModel.aggregate(pipeline);

    return {
      currentPage: page,
      // totalPage: Math.ceil(count[0] / pageSize),
      totalItem: count,
      data: coins,
    };
  }

  async getCoinBySlug(slug) {
    const coins = await this.coinModel.aggregate([
      { $match: { slug } },
      {
        $lookup: {
          from: 'chains',
          localField: 'chainId',
          foreignField: 'scanValue',
          as: 'chain',
        },
      },
      { $addFields: { chain: { $arrayElemAt: ['$chain', 0] } } },
      { $limit: 1 },
    ]);
    const coin = coins?.[0] ? coins[0] : null;
    // const coin = await this.coinModel.findOne({ slug });
    return { data: coin };
  }

  async create(body: CreateCoinDto) {
    const slug = toSlug(body?.name);

    const http = this.httpService.get(
      'https://api.dexscreener.com/latest/dex/tokens/' + body.contractAddress,
    );

    const res = await lastValueFrom(http);

    const tokenInfo = res.data?.pairs?.find(
      (item) => item?.baseToken?.address === body.contractAddress,
    );

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

    const coin = new this.coinModel(body);

    if (tokenInfo) {
      console.log(tokenInfo);
    }
    await coin.save();
    return { data: coin };
  }

  async updateCoinLogoBySlug(slug: string, file: Express.Multer.File) {
    const coin = await this.coinModel.findOne({ slug });
    return { data: coin };
  }

  async upVote(slug) {
    const coin = await this.coinModel.findOne({ slug });

    coin.totalVotes += 1;
    await coin.save();

    return { data: coin };
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
