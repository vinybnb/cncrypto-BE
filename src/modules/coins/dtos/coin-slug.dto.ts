import { IsEnum, IsString, Length, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFile } from '@common/decorators/validator.decorator';
import { CHAIN } from '../coin.enum';

export class CoinSlugDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  slug: string;
}
