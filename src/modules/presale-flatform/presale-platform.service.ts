import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { CreatePresalePlatformDto } from './dtos/create-presale-platform.dto';
import { FilterPresalePlatformDto } from './dtos/filter-presale-platform.dto';
import { PresalePlatformIdDto } from './dtos/presale-platform-id.dto';
import { UpdatePresalePlatformDto } from './dtos/update-presale-platform.dto';
import {
  PresalePlatform,
  PresalePlatformDocument,
} from './presale-platform.shema';

@Injectable()
export class PresalePlatformService {
  constructor(
    @InjectModel(PresalePlatform.name)
    private presalePlatformModel: Model<PresalePlatformDocument>,
  ) {}

  async getAll(dto: FilterPresalePlatformDto) {
    const { sortBy, sortDirection = 'desc', page, pageSize } = dto;

    const pipeline: PipelineStage[] = [];

    const countAggregate = await this.presalePlatformModel.aggregate([
      ...pipeline,
      { $count: 'count' },
    ]);
    const count = countAggregate?.[0]?.count || 0;

    pipeline.push({
      $sort: { [sortBy]: sortDirection?.toLowerCase() === 'asc' ? 1 : -1 },
    });
    pipeline.push({ $skip: (page - 1) * pageSize });
    pipeline.push({ $limit: +pageSize });

    const banner = await this.presalePlatformModel.aggregate(pipeline);
    return {
      currentPage: +page,
      totalPage: Math.ceil(count / pageSize),
      totalItem: count,
      data: banner,
    };
  }

  async getDetail(dto: PresalePlatformIdDto) {
    const banner = await this.presalePlatformModel.findById(dto._id);
    return { data: banner };
  }

  async create(dto: CreatePresalePlatformDto) {
    const banner = await this.presalePlatformModel.create(dto);
    return { data: banner };
  }

  async update(dto: UpdatePresalePlatformDto) {
    await this.presalePlatformModel.updateOne({ _id: dto._id }, dto);
    return { result: 'success' };
  }

  async delete(dto: PresalePlatformIdDto) {
    await this.presalePlatformModel.deleteOne({ _id: dto._id });
    return { result: 'success' };
  }
}
