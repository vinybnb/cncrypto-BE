import { IsNullable } from '@common/decorators/validator.decorator';
import { IsDateString, IsString } from 'class-validator';
import { BannerPlacement } from '../types/enum';

export class UpdatePromoteBannerDto {
  @IsString()
  _id: string;

  @IsString()
  @IsNullable()
  link: string;

  @IsString()
  @IsNullable()
  imageUrl: string;

  @IsString()
  @IsNullable()
  placement: BannerPlacement;

  @IsDateString()
  @IsNullable()
  expiredAt: string;
}
