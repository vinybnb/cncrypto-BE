import { IsString } from 'class-validator';

export class PresalePlatformIdDto {
  @IsString()
  _id: string;
}
