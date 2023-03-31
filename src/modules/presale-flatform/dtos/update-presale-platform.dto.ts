import { IsNullable } from '@common/decorators/validator.decorator';
import { IsString, IsUrl } from 'class-validator';

export class UpdatePresalePlatformDto {
  @IsString()
  _id: string;

  @IsString()
  @IsNullable()
  name: string;

  @IsUrl()
  @IsNullable()
  logo: string;
}
