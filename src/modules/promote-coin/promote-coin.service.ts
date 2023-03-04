import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  FilterQuery,
  Model,
  PipelineStage,
  QueryOptions,
} from 'mongoose';
import { Coin, CoinDocument } from '../coins/coin.shema';
import { CreatePromoteCoinDto } from './dtos/create-promote-coin.dto';
import { FilterPromoteCoinDto } from './dtos/filter-promote-coin.dto';
import { PromoteCoinIdDto } from './dtos/promote-coin-id.dto';
import { UpdatePromoteCoinDto } from './dtos/update-promote-coin.dto';
import { PromoteCoin, PromoteCoinDocument } from './promote-coin.shema';

@Injectable()
export class PromoteCoinService {
  constructor(
    @InjectModel(PromoteCoin.name)
    private promoteCoinModel: Model<PromoteCoinDocument>,
  ) {}

  async getAllPromoteCoin(dto: FilterPromoteCoinDto) {
    const { unexpired, sortBy, sortDirection = 'desc', page, pageSize } = dto;

    const queryFilter: FilterQuery<PromoteCoinDocument> = {
      $and: [],
    };

    if (unexpired === 'false') {
      queryFilter.$and.push({ expiredAt: { $lt: new Date() } });
    }

    if (unexpired === 'true') {
      queryFilter.$and.push({ expiredAt: { $gte: new Date() } });
    }

    const queryOptions = {
      $sort: { [sortBy]: sortDirection?.toLowerCase() === 'asc' ? 1 : -1 },
      $skip: (page - 1) * pageSize,
      $limit: +pageSize,
    };

    const count = await this.promoteCoinModel.count(queryFilter);
    // const coins = await this.promoteCoinModel
    //   .find(queryFilter)
    //   .sort({ [sortBy]: sortDirection?.toLowerCase() === 'asc' ? 1 : -1 })
    //   .skip((page - 1) * pageSize)
    //   .limit(+pageSize)
    //   .populate('coin');
    const coins = await this.promoteCoinModel.find().populate('coin');

    return {
      currentPage: +page,
      totalPage: Math.ceil(count / pageSize),
      totalItem: count,
      data: coins,
    };
  }

  async getDetailPromoteCoin(dto: PromoteCoinIdDto) {
    const coin = await this.promoteCoinModel.findById(dto._id);
    return { data: coin };
  }

  async createPromoteCoin(dto: CreatePromoteCoinDto) {
    if (!mongoose.Types.ObjectId.isValid(dto?.coin)) {
      throw new BadRequestException('Coin must is ObjectId');
    }

    const coin = await this.promoteCoinModel.create({
      ...dto,
      coin: new mongoose.Types.ObjectId(dto.coin),
    });
    
    return { data: coin };
  }

  async updatePromoteCoin(dto: UpdatePromoteCoinDto) {
    await this.promoteCoinModel.updateOne({ _id: dto._id }, dto);
    return { result: 'success' };
  }

  async deletePromoteCoin(dto: PromoteCoinIdDto) {
    await this.promoteCoinModel.deleteOne({ _id: dto._id });
    return { result: 'success' };
  }
}
