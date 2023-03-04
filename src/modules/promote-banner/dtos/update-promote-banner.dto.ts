import { IsNullable } from '@common/decorators/validator.decorator';
import { IsDateString, IsString, IsUrl } from 'class-validator';

export class UpdatePromoteBannerDto {
  @IsString()
  _id: string;

  @IsString()
  @IsNullable()
  link: string;

  @IsUrl()
  @IsNullable()
  imageUrl: string;

  @IsDateString()
  @IsNullable()
  expiredAt: string;
}
