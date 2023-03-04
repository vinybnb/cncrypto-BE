import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coin, CoinDocument } from '../coins/coin.shema';
import { PromoteIdDto } from './dtos/promote-id.dto';
import { PromotedList, PromotedListDocument } from './promoted-list.shema';

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

  async getPromotedCoinDetail(dto: PromoteIdDto) {
    return this.promotedModel.findById(dto._id).populate('coin');
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
