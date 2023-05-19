import { uuidV4 } from '@common/helpers/string.helper';
import { PUBLIC_DIR, PUBLIC_URL } from '@configs/app';
import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs';
import { Model, PipelineStage } from 'mongoose';
import path from 'path';
import { CreatePromoteBannerDto } from './dtos/create-promote-banner.dto';
import { FilterPromoteBannerDto } from './dtos/filter-promote-banner.dto';
import { PromoteBannerIdDto } from './dtos/promote-banner-id.dto';
import { UpdateImagePromoteBannerDto } from './dtos/update-image-promote-banner.dto';
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

  async updateImage(
    dto: UpdateImagePromoteBannerDto,
    fileLogo: Express.Multer.File,
  ) {
    const LIMIT_FILE_SIZE = 10 * 1024 * 1024;

    if (fileLogo?.size > LIMIT_FILE_SIZE) {
      throw new PayloadTooLargeException('Image size must less than 10MB');
    }
    if (!fileLogo?.mimetype?.startsWith('image')) {
      throw new BadRequestException('File must be image');
    }

    if (!fs.existsSync(path.join(PUBLIC_DIR, 'promotion-banner'))) {
      fs.mkdirSync(path.join(PUBLIC_DIR, 'promotion-banner'), {
        recursive: true,
      });
    }
    const fileName = uuidV4() + '_' + fileLogo.originalname;
    const filePath = path.join(PUBLIC_DIR, 'promotion-banner', fileName);
    fs.writeFileSync(filePath, fileLogo.buffer);
    const url = `${PUBLIC_URL}/promotion-banner/` + fileName;
    const banner = await this.promoteBannerModel.findById(dto._id);
    if (!!banner?.imageUrl) {
      const oldPath = path.join(
        PUBLIC_DIR,
        banner?.imageUrl?.replace(PUBLIC_URL, ''),
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    await this.promoteBannerModel.updateMany(
      { _id: dto._id },
      { imageUrl: url },
    );
    return { result: 'success' };
  }

  async deletePromoteBanner(dto: PromoteBannerIdDto) {
    const banner = await this.promoteBannerModel.findById(dto._id);
    if (!!banner?.imageUrl) {
      const oldPath = path.join(
        PUBLIC_DIR,
        banner?.imageUrl?.replace(PUBLIC_URL, ''),
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    await this.promoteBannerModel.deleteOne({ _id: dto._id });
    return { result: 'success' };
  }
}
