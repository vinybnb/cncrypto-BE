import { IsString } from 'class-validator';

export class PromoteBannerIdDto {
  @IsString()
  _id: string;
}
