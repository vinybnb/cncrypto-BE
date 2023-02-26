import {
  IsEnum,
  IsString,
  Length,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsNumberString,
  ValidateIf,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFile, IsNullable } from '@common/decorators/validator.decorator';
import { CHAIN, STATUS } from '../coin.enum';
import { Transform } from 'class-transformer';

class CreateCoinChainDto {
  @IsNumber()
  chainId: number;

  @IsString()
  contractAddress: string;

  pairAddress: string = '';
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
  totalVotes: number = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  price: number = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  marketCap: number = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  liquidity: number = 0;

  @IsNumber()
  @Transform(({ value }) => +value || 0)
  h1: number = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  h6: number = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  h24: number = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  tnxH6: number = 0;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 0)
  tnxH24: number = 0;

  @IsArray()
  @IsNullable()
  links: CreateCoinLinkDto[];
}
