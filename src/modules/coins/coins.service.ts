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
import { CoinDto } from './dtos/coin.dto';
import { toSlug } from '@common/helpers/string.helper';
import { FilterCoinDto } from './dtos/filter-coin.dto';

@Injectable()
export class CoinsService {
  constructor(@InjectModel(Coin.name) private coinModel: Model<CoinDocument>) {}

  async create(body: CoinDto) {
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

    const coin = new this.coinModel(body);
    await coin.save();
    return { data: coin };
  }

  async findAll(filter: FilterCoinDto) {
    const {
      chainId,
      approved,
      promoted,
      search = '',
      page = 1,
      pageSize = 10,
    } = filter;

    const filterQuery: FilterQuery<Coin> = {};

    const pipeline: PipelineStage[] = [];

    if (search) {
      pipeline.push({ $match: { name: { $regex: 'keyword', $options: 'g' } } });
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

    const count = await this.coinModel.aggregate([
      ...pipeline,
      { $count: 'count' },
    ]);

    pipeline.push({
      $lookup: {
        from: 'chains',
        localField: 'chainId',
        foreignField: 'scanValue',
        as: 'chain',
      },
    });

    pipeline.push({ $addFields: { chain: { $arrayElemAt: ['$chain', 0] } } });
    pipeline.push({ $skip: (page - 1) * pageSize });
    pipeline.push({ $limit: +pageSize });

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
