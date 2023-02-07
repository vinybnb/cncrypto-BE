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
import { Chain } from 'src/chains/coin.shema';

@Injectable()
export class CoinsService {
  constructor(@InjectModel(Coin.name) private coinModel: Model<CoinDocument>) {}

  async create(body) {
    body = this.toCamelCase(body);
    const slug = this.clean_url(body?.name);

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
    return coin;
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
      .limit(pageSize)
      .populate('chains.chain');
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
    return coin;
  }

  async upVote(slug) {
    const coin = await this.coinModel.findOne({ slug });

    coin.totalVotes += 1;
    await coin.save();

    return coin;
  }

  async approveCoin(slug) {
    const coin = await this.coinModel.findOne({ slug });

    coin.status = STATUS.APPROVED;
    await coin.save();
    // Object.assign(coin, { status: STATUS.APPROVED });

    return coin;
  }

  private clean_url(s) {
    return s
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') //remove diacritics
      .toLowerCase()
      .replace(/\s+/g, '-') //spaces to dashes
      .replace(/&/g, '-and-') //ampersand to and
      .replace(/[^\w\-]+/g, '') //remove non-words
      .replace(/\-\-+/g, '-') //collapse multiple dashes
      .replace(/^-+/, '') //trim starting dash
      .replace(/-+$/, ''); //trim ending dash
  }

  private toCamelCase(obj: { [key in string]: any }) {
    const newObj = {};
    for (let source in obj) {
      let output = '';
      for (let i = 0; i < source.length; i++) {
        if (source[i] === '_') {
          i++;
          output += source[i].toUpperCase();
        } else {
          output += source[i];
        }
      }
      if (!Array.isArray(obj[source]) && typeof obj[source] === 'object') {
        newObj[output] = this.toCamelCase(obj[source]);
      } else {
        newObj[output] = obj[source];
      }
    }
    return newObj;
  }
}
