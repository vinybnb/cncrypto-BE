import { IsNullable } from '@common/decorators/validator.decorator';
import { Transform } from 'class-transformer';
import {
  IsArray,
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
  logo: string = null;

  @IsArray()
  @IsNullable()
  chains: UpdateCoinChainDto[] = [];

  @IsString()
  @IsNullable()
  description: string = null;

  @IsString()
  @IsNullable()
  descriptionCn: string = null;

  // @IsEnum(STATUS)
  @IsNullable()
  status: STATUS = null;

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
  links: UpdateCoinLinkDto[];
}
