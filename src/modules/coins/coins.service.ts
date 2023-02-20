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
import { FilterQuery, Model } from 'mongoose';
import { Chain } from '@modules/chains/coin.shema';
import { CoinDto } from './dtos/coin.dto';
import { toSlug } from '@common/helpers/string.helper';

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

  async findAll(query) {
    const { chain, search = '', page = 1, pageSize = 10 } = query;

    const filterQuery: FilterQuery<Coin> = {};

    if (search) {
      filterQuery.$and = [{ name: { $regex: 'keyword', $options: 'g' } }];
    }

    const coins = await this.coinModel
      .find(filterQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await this.coinModel.count(filterQuery);

    return {
      currentPage: page,
      totalPage: Math.ceil(count / pageSize),
      totalItem: count,
      data: coins,
    };
  }

  async getCoinBySlug(slug) {
    const coin = await this.coinModel.findOne({ slug });
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
    await coin.save();
    // Object.assign(coin, { status: STATUS.APPROVED });

    return { data: coin };
  }
}
