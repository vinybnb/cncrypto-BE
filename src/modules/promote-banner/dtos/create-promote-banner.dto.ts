import { IsDateString, IsString, IsUrl } from 'class-validator';

export class CreatePromoteBannerDto {
  @IsString()
  link: string;

  @IsUrl()
  imageUrl: string;

  @IsDateString()
  expiredAt: string;
}
