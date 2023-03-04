import { IsString } from 'class-validator';

export class PromoteCoinIdDto {
  @IsString()
  _id: string;
}
