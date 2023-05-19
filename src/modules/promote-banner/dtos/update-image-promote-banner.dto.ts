import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateImagePromoteBannerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false, format: 'string' })
  _id: string;

  @ApiProperty({ required: false, format: 'binary' })
  image: string;
}
