import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CoinSlugDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  slug: string;
}
