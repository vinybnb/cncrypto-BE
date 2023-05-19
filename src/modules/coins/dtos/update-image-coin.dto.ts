import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateImageCoinDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false, format: 'string' })
  slug: string;

  @ApiProperty({ required: false, format: 'binary' })
  logo: string;
}
