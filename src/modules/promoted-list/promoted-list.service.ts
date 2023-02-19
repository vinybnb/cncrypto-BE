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
import { Coin, CoinDocument } from '../coins/coin.shema';
import { PromotedList, PromotedListDocument } from './promoted-list.shema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class PromotedService {
  constructor(
    @InjectModel(Coin.name) private coinModel: Model<CoinDocument>,
    @InjectModel(PromotedList.name)
    private promotedModel: Model<PromotedListDocument>,
  ) {}

  async getPromotedList() {
    return this.promotedModel.find().populate('coin');
  }

  async addPromotedListCoin(slug, body) {
    const coin = await this.coinModel.findOne({ slug });
    if (!coin) {
      throw new NotFoundException('Project doesn"t existed');
    }

    const promotedCoin = await this.promotedModel.findOne({ coin: coin._id });
    if (promotedCoin) {
      throw new BadRequestException('project added');
    }

    const promoted = new this.promotedModel(body);
    promoted.coin = coin;
    await promoted.save();

    return promoted;
  }

  async deleteCoinInPromotedList(slug) {
    const coin = await this.coinModel.findOne({ slug });
    const deleted = await this.promotedModel.deleteMany({ coin: coin?._id });

    return { deletedCount: deleted?.deletedCount };
  }
}
