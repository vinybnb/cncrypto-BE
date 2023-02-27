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
import { Transform, Exclude, Expose } from 'class-transformer';
import moment from 'moment';
import { toPlainString, toShorten } from '@common/helpers/number.helper';

export class ResponseCoinDto {
  id: number;

  name: string;

  symbol: string;

  slug: string;

  logo: string = null;

  chains: any[];

  description: string = null;

  status: STATUS = STATUS.APPROVING;

  whitelistLink: string = null;

  whitelistAt: Date = null;

  @Transform(({ obj }) =>
    obj?.whitelistAt ? moment(obj.whitelistAt).fromNow() : null,
  )
  @Expose()
  whitelistPeriod: string = null;

  launchAt: Date = null;

  @Transform(({ obj }) =>
    obj?.launchAt ? moment(obj.launchAt).fromNow() : null,
  )
  @Expose()
  launchPeriod: string = null;

  preSaleLink: string = null;

  preSalePlatform: string = null;

  preSaleAt: Date = null;

  @Transform(({ obj }) =>
    obj?.preSaleAt ? moment(obj.preSaleAt).fromNow() : null,
  )
  @Expose()
  preSalePeriod: string = null;

  approvedAt: Date = null;

  @Transform(({ obj }) =>
    obj?.approvedAt ? moment(obj.approvedAt).fromNow() : null,
  )
  @Expose()
  approvedPeriod: string = null;

  totalVotes: number = 0;

  price: number = 0;

  @Transform(({ obj }) => toPlainString(+obj?.price))
  @Expose()
  pricePlain: string = '';

  marketCap: number = 0;

  @Transform(({ obj }) => Intl.NumberFormat(undefined).format(+obj?.marketCap))
  @Expose()
  marketCapReadable: string = '';

  @Transform(({ obj }) => toShorten(+obj?.marketCap))
  @Expose()
  marketCapShorten: string = '';

  liquidity: number = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.liquidity || 0),
  )
  @Expose()
  liquidityReadable: string = '';

  @Transform(({ obj }) => toShorten(+obj?.liquidity || 0))
  @Expose()
  liquidityShorten: string = '';

  h1: number = 0;

  h6: number = 0;

  h24: number = 0;

  tnxH6: number = 0;

  tnxH24: number = 0;

  links: any[];
}
