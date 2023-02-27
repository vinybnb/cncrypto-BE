import {
  IsEnum,
  IsString,
  IsArray,
  IsNumber,
  IsUrl,
  IsDateString,
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

  @IsEnum(STATUS)
  @IsNullable()
  status: STATUS = STATUS.APPROVING;

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
  preSaleLink: string = null;

  @IsString()
  @IsNullable()
  preSalePlatform: string = null;

  @IsDateString()
  @IsNullable()
  preSaleAt: Date = null;

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
  liquidity = 0;

  @IsNumber()
  @Transform(({ value }) => +value || 0)
  h1 = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  h6 = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  h24 = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  tnxH6 = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  tnxH24 = 0;

  @IsArray()
  @IsNullable()
  links: CreateCoinLinkDto[];
}
