import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VoteCoinDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  recaptchaToken: string;
}
