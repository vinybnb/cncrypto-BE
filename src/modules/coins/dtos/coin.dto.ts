import { IsEnum, IsString, Length, IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFile } from '@common/decorators/validator.decorator';
import { CHAIN } from '../coin.enum';

export class CoinDto {
  @IsString()
  @Length(1, 100)
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @Length(1, 100)
  @ApiProperty({ required: true })
  symbol: string;

  // @IsString()
  // @Length(1, 256)
  // @IsFile({ mimeType: ['image/jpeg', 'image/jpg', 'image/png'] })
  @ApiProperty({ required: true })
  logo: string;

  @ApiProperty({ required: false })
  slug: string;

  @ApiProperty({ required: true })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  chainId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  contractAddress: string;

  @ApiProperty({ required: false })
  whitelistLink: string;

  @ApiProperty({ required: false })
  launchDate: string;

  @ApiProperty({ required: false })
  launchTime: string;

  @ApiProperty({ required: false })
  preSaleLink: string;

  @ApiProperty({ required: false })
  preSalePlatform: string;

  @ApiProperty({ required: false })
  preSaleTime: string;

  @ApiProperty({ required: false })
  approvedAt: string;

  @ApiProperty({ required: false })
  totalVotes: string;

  @ApiProperty({ required: false })
  status: string;

  @ApiProperty({ required: false })
  linkWebsite: string;

  @ApiProperty({ required: false })
  linkTelegram: string;

  @ApiProperty({ required: false })
  linkTwitter: string;

  @ApiProperty({ required: false })
  linkDiscord: string;

  @ApiProperty({ required: false })
  linkMedium: string;
}
