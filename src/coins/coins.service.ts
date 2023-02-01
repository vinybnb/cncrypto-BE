import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Coin } from './coin.entity';
import { STATUS } from './coin.enum';
import { PromotedList } from './promoted-list.entity';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin) private coinRepo: Repository<Coin>,
    @InjectRepository(PromotedList)
    private promotedListRepo: Repository<PromotedList>,
  ) {}

  async create(body) {
    const symbol = await this.coinRepo.find({ symbol: body.symbol });
    const contractAddress = await this.coinRepo.find({
      contractAddress: body.contractAddress,
    });

    if (symbol?.length || contractAddress?.length) {
      throw new BadRequestException('Coin has been existed');
    }

    body.slug = this.clean_url(body.name);
    const coin = this.coinRepo.create(body);
    return this.coinRepo.save(coin);
  }

  async getPromotedList() {
    return this.promotedListRepo.manager
      .getMongoRepository(PromotedList)
      .aggregate([
        {
          $lookup: {
            from: 'coin',
            localField: 'coinId',
            foreignField: '_id',
            as: 'coin',
          },
        },
      ])
      .next();
    // .createQueryBuilder('promotedList')
    // .leftJoinAndSelect('promotedList.coin', 'coin')
    // .getMany();
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

  async findAll(query) {
    const take = 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const keyword = query.search || '';
    const chain = query.chain || '';
    const status = query.status || STATUS.APPROVED;
    const launchTimeOrder = query?.launch_time === 'ASC' ? 'ASC' : 'DESC';
    const totalVotesOrder = query?.total_vote || 'DESC';
    const [result, total] = await this.coinRepo.findAndCount({
      where: {
        name: new RegExp(keyword),
        chain,
        status,
      },
      order: {
        launchTime: launchTimeOrder,
        totalVotes: totalVotesOrder,
      },
      take: take,
      skip: skip,
    });

    return {
      data: result,
      count: total,
    };
  }

  async upVote(slug) {
    const coin = await this.findOne(slug);

    const totalVotes = coin.totalVotes + 1;

    Object.assign(coin, { totalVotes });

    return this.coinRepo.save(coin);
  }

  async approveCoin(slug) {
    const coin = await this.findOne(slug);
    Object.assign(coin, { status: STATUS.APPROVED });
    return this.coinRepo.save(coin);
  }

  private findOne(slug) {
    return this.coinRepo.findOne({ slug });
  }

  private getPromotedCoin(id: string) {
    return this.promotedListRepo.find({ coinId: id });
  }

  private getBySlug(slug: string) {
    return this.coinRepo.find({ slug });
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
}
