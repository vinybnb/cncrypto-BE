import { IsNullable } from '@common/decorators/validator.decorator';
import { IsDateString, IsString } from 'class-validator';

export class CreatePromoteBannerDto {
  @IsString()
  link: string;

  @IsString()
  @IsNullable()
  imageUrl: string;

  @IsDateString()
  expiredAt: string;
}
