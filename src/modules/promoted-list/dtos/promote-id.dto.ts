import { IsString } from 'class-validator';

export class PromoteIdDto {
  @IsString()
  _id: string;
}
