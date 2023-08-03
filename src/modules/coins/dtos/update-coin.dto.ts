import { IsNullable } from '@common/decorators/validator.decorator';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { STATUS } from '../coin.enum';

class UpdateCoinChainDto {
  @IsNumber()
  chainId: number;

  @IsString()
  contractAddress: string;

  pairAddress = '';
}

class UpdateCoinLinkDto {
  @IsString()
  name: string;

  @IsString()
  link: string;

  @IsNumber()
  @Transform(({ value }) => +value || 0)
  socialCount: number;
}

export class UpdateCoinDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  id: number;

  name: string;

  @IsString()
  @IsNullable()
  symbol: string;

  slug: string;

  @IsUrl()
  @IsNullable()
  logo: string;

  @IsArray()
  @IsNullable()
  chains: UpdateCoinChainDto[];

  @IsString()
  @IsNullable()
  listingType: string;

  @IsString()
  @IsNullable()
  description: string;

  @IsString()
  @IsNullable()
  descriptionCn: string;

  // @IsEnum(STATUS)
  @IsNullable()
  status: STATUS;

  @IsBoolean()
  @IsNullable()
  premium: boolean;

  @IsString()
  @IsNullable()
  whitelistLink: string;

  @IsDateString()
  @IsNullable()
  whitelistAt: Date;

  @IsDateString()
  @IsNullable()
  launchAt: Date;

  @IsString()
  @IsNullable()
  presaleLink: string;

  @IsString()
  @IsNullable()
  presalePlatform: string;

  @IsDateString()
  @IsNullable()
  presaleStartAt: Date;

  @IsDateString()
  @IsNullable()
  presaleEndAt: Date;

  @IsDateString()
  @IsNullable()
  approvedAt: Date;

  @IsNullable()
  totalVotes;

  @IsNullable()
  price;

  @IsNullable()
  marketCap;

  @IsNullable()
  liquidityUsd;

  @IsNumber()
  @IsNullable()
  change1h;

  @IsNullable()
  change6h;

  @IsNullable()
  change24h;

  volume1h;

  @IsNullable()
  volume6h;

  @IsNullable()
  volume24h;

  @IsNullable()
  tnx6h;

  @IsNullable()
  tnx24h;

  @IsArray()
  @IsNullable()
  links: UpdateCoinLinkDto[];
}
