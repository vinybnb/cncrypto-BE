import { IsString, IsUrl } from 'class-validator';

export class CreatePresalePlatformDto {
  @IsString()
  name: string;

  @IsUrl()
  logo: string;
}
