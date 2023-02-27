import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chain, ChainDocument } from './coin.shema';

@Injectable()
export class ChainService {
  constructor(
    @InjectModel(Chain.name) private chainModel: Model<ChainDocument>,
  ) {}

  async getChains() {
    const chain = await this.chainModel.find();

    return {
      currentPage: 1,
      totalPage: 1,
      totalItem: chain?.length,
      data: chain,
    };
  }

  async createChain(body) {
    const chain = await this.chainModel.create(body);

    return { data: chain };
  }
}
