import { IsDateString, IsString, IsUrl } from 'class-validator';

export class CreatePromoteDto {
  @IsString()
  link: string;

  @IsUrl()
  imageUrl: string;

  @IsDateString()
  expiredAt: string;
}
