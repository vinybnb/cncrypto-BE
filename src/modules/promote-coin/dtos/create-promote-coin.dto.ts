import { IsNullable } from '@common/decorators/validator.decorator';
import { IsDateString, IsString, IsUrl } from 'class-validator';

export class CreatePromoteCoinDto {
  @IsString()
  coin: string;

  @IsDateString()
  @IsNullable()
  startAt: string;

  @IsDateString()
  expiredAt: string;
}
