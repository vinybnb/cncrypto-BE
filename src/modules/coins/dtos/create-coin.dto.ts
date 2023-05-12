import {
  IsEnum,
  IsString,
  IsArray,
  IsNumber,
  IsUrl,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { IsNullable } from '@common/decorators/validator.decorator';
import { STATUS } from '../coin.enum';
import { Transform } from 'class-transformer';

class CreateCoinChainDto {
  @IsNumber()
  chainId: number;

  @IsString()
  contractAddress: string;

  pairAddress = '';
}

class CreateCoinLinkDto {
  @IsString()
  name: string;

  @IsString()
  link: string;

  @IsNumber()
  @Transform(({ value }) => +value || 0)
  socialCount: number;
}

export class CreateCoinDto {
  id: number;

  @IsString()
  name: string;

  @IsString()
  symbol: string;

  slug: string;

  @IsUrl()
  logo: string = null;

  @IsArray()
  @IsNullable()
  chains: CreateCoinChainDto[] = [];

  @IsString()
  @IsNullable()
  description: string = null;

  @IsString()
  @IsNullable()
  listingType: string = null;

  @IsString()
  @IsNullable()
  descriptionCn: string = null;

  @IsEnum(STATUS)
  @IsNullable()
  status: STATUS = STATUS.APPROVING;

  @IsBoolean()
  @IsNullable()
  premium: boolean;

  @IsString()
  @IsNullable()
  whitelistLink: string = null;

  @IsDateString()
  @IsNullable()
  whitelistAt: Date = null;

  @IsDateString()
  @IsNullable()
  launchAt: Date = null;

  @IsString()
  @IsNullable()
  presaleLink: string = null;

  @IsString()
  @IsNullable()
  presalePlatform: string = null;

  @IsDateString()
  @IsNullable()
  presaleStartAt: Date = null;

  @IsDateString()
  @IsNullable()
  presaleEndAt: Date = null;

  @IsDateString()
  @IsNullable()
  approvedAt: Date = null;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  totalVotes = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  price = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  marketCap = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  liquidityUsd = 0;

  @IsNumber()
  @Transform(({ value }) => +value || 0)
  change1h = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  change6h = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  change24h = 0;

  @IsNumber()
  @Transform(({ value }) => +value || 0)
  volume1h = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  volume6h = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  volume24h = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  tnx6h = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  tnx24h = 0;

  @IsArray()
  @IsNullable()
  links: CreateCoinLinkDto[];
}
