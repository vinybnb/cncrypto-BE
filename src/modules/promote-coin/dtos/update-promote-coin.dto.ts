import { IsNullable } from '@common/decorators/validator.decorator';
import { IsDateString, IsString, IsUrl } from 'class-validator';

export class UpdatePromoteCoinDto {
  @IsString()
  _id: string;

  @IsString()
  coin: string;

  @IsDateString()
  @IsNullable()
  startAt: string;

  @IsDateString()
  expiredAt: string;
}
