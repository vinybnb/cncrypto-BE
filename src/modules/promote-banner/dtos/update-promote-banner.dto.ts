import { IsNullable } from '@common/decorators/validator.decorator';
import { IsDateString, IsString } from 'class-validator';

export class UpdatePromoteBannerDto {
  @IsString()
  _id: string;

  @IsString()
  @IsNullable()
  link: string;

  @IsString()
  @IsNullable()
  imageUrl: string;

  @IsDateString()
  @IsNullable()
  expiredAt: string;
}
