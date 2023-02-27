import { STATUS } from '../coin.enum';
import { Transform, Expose } from 'class-transformer';
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

  totalVotes = 0;

  price = 0;

  @Transform(({ obj }) => toPlainString(+obj?.price))
  @Expose()
  pricePlain = '';

  marketCap = 0;

  @Transform(({ obj }) => Intl.NumberFormat(undefined).format(+obj?.marketCap))
  @Expose()
  marketCapReadable = '';

  @Transform(({ obj }) => toShorten(+obj?.marketCap))
  @Expose()
  marketCapShorten = '';

  liquidity = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.liquidity || 0),
  )
  @Expose()
  liquidityReadable = '';

  @Transform(({ obj }) => toShorten(+obj?.liquidity || 0))
  @Expose()
  liquidityShorten = '';

  h1 = 0;

  h6 = 0;

  h24 = 0;

  tnxH6 = 0;

  tnxH24 = 0;

  links: any[];
}
