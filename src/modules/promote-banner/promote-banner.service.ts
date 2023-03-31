import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { CreatePromoteBannerDto } from './dtos/create-promote-banner.dto';
import { FilterPromoteBannerDto } from './dtos/filter-promote-banner.dto';
import { PromoteBannerIdDto } from './dtos/promote-banner-id.dto';
import { UpdatePromoteBannerDto } from './dtos/update-promote-banner.dto';
import { PromoteBanner, PromoteBannerDocument } from './promote-banner.shema';

@Injectable()
export class PromoteBannerService {
  constructor(
    @InjectModel(PromoteBanner.name)
    private promoteBannerModel: Model<PromoteBannerDocument>,
  ) {}

  async getAllPromoteBanner(dto: FilterPromoteBannerDto) {
    const { unexpired, sortBy, sortDirection = 'desc', page, pageSize } = dto;

    const pipeline: PipelineStage[] = [];

    if (unexpired === 'false') {
      pipeline.push({ $match: { expiredAt: { $lt: new Date() } } });
    }

    if (unexpired === 'true') {
      pipeline.push({ $match: { expiredAt: { $gte: new Date() } } });
    }

    const countAggregate = await this.promoteBannerModel.aggregate([
      ...pipeline,
      { $count: 'count' },
    ]);
    const count = countAggregate?.[0]?.count || 0;

    pipeline.push({
      $sort: { [sortBy]: sortDirection?.toLowerCase() === 'asc' ? 1 : -1 },
    });
    pipeline.push({ $skip: (page - 1) * pageSize });
    pipeline.push({ $limit: +pageSize });

    const banner = await this.promoteBannerModel.aggregate(pipeline);
    return {
      currentPage: +page,
      totalPage: Math.ceil(count / pageSize),
      totalItem: count,
      data: banner,
    };
  }

  async getDetailPromoteBanner(dto: PromoteBannerIdDto) {
    const banner = await this.promoteBannerModel.findById(dto._id);
    return { data: banner };
  }

  async createPromoteBanner(dto: CreatePromoteBannerDto) {
    const banner = await this.promoteBannerModel.create(dto);
    return { data: banner };
  }

  async updatePromoteBanner(dto: UpdatePromoteBannerDto) {
    await this.promoteBannerModel.updateOne({ _id: dto._id }, dto);
    return { result: 'success' };
  }

  async deletePromoteBanner(dto: PromoteBannerIdDto) {
    await this.promoteBannerModel.deleteOne({ _id: dto._id });
    return { result: 'success' };
  }
}
