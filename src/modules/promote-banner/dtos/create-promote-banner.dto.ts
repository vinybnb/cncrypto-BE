import { IsNullable } from '@common/decorators/validator.decorator';
import { IsDateString, IsString } from 'class-validator';

export class CreatePromoteBannerDto {
  @IsString()
  link = '';

  @IsString()
  @IsNullable()
  imageUrl = '';

  @IsDateString()
  expiredAt: string;
}
