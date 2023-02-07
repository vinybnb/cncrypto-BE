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
import { Coin as CoinEntity } from '../coins/coin.entity';
import { Coin, CoinDocument } from '../coins/coin.shema';
import { PromotedList as PromotedListEntity } from './promoted-list.entity';
import { PromotedList, PromotedListDocument } from './promoted-list.shema';
import { Model } from 'mongoose';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(Coin.name) private coinModel: Model<CoinDocument>,
    @InjectModel(PromotedList.name)
    private promotedModel: Model<PromotedListDocument>,
    @InjectRepository(CoinEntity) private coinRepo: Repository<CoinEntity>,
    @InjectRepository(PromotedListEntity)
    private promotedListRepo: Repository<PromotedList>,
  ) {}


  async getPromotedList() {
    return this.promotedListRepo.manager
      .getMongoRepository(PromotedList)
      .aggregate([
        {
          $lookup: {
            from: 'coin',
            localField: 'coin',
            foreignField: '_id',
            as: 'coin',
          },
        },
      ])
      .next();
  }

  async addPromotedListCoin(url, body) {
    const coin = await this.getBySlug(url);
    if (coin.length === 0) {
      throw new NotFoundException('Project doesn"t existed');
    }

    const promotedCoin = await this.getPromotedCoin(coin[0].id);
    if (promotedCoin.length !== 0) {
      throw new BadRequestException('project added');
    }

    const promoted = this.promotedListRepo.create({
      ...body,
      coinId: coin[0].id,
    });

    return this.promotedListRepo.save(promoted);
  }

  async deleteCoinInPromotedList(url) {
    const coin = await this.getBySlug(url);
    const promotedCoin = await this.getPromotedCoin(coin[0].id);

    if (coin.length === 0 || promotedCoin.length === 0) {
      throw new NotFoundException('Project doesn"t existed');
    }
    return this.promotedListRepo.remove(promotedCoin);
  }


  private getPromotedCoin(id: string) {
    return this.promotedListRepo.find({ coin: id });
  }

  private getBySlug(slug: string) {
    return this.coinRepo.find({ slug });
  }

}
