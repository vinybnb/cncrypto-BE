import { IsNullable } from '@common/decorators/validator.decorator';
import { IsDateString, IsString } from 'class-validator';
import { BannerPlacement } from '../types/enum';

export class CreatePromoteBannerDto {
  @IsString()
  link = '';

  @IsString()
  @IsNullable()
  imageUrl = '';

  @IsString()
  @IsNullable()
  placement: BannerPlacement = BannerPlacement.TopSlide;

  @IsDateString()
  expiredAt: string;
}
