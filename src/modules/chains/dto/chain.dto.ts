import { IsEnum, IsString, Length, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChainDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  symbol: string;

  @IsString()
  @ApiProperty()
  currencySymbol: string;

  @IsString()
  @ApiProperty()
  scanKey: string;

  @IsString()
  @ApiProperty()
  scanValue: string;

  @IsString()
  @ApiProperty()
  slug: string;
}
