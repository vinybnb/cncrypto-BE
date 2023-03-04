import { STATUS } from '../coin.enum';
import { Transform, Expose } from 'class-transformer';
import moment from 'moment';
import { toPlainString, toShorten } from '@common/helpers/number.helper';

export class ResponseCoinDto {
  @Transform((value) => value?.obj?._id?.toString())
  _id: string;

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

  liquidityUsd = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.liquidityUsd || 0),
  )
  @Expose()
  liquidityUsdReadable = '';

  @Transform(({ obj }) => toShorten(+obj?.liquidityUsd || 0))
  @Expose()
  liquidityUsdShorten = '';

  change1h = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.change1h || 0),
  )
  @Expose()
  change1hReadable = 0;

  @Transform(({ obj }) => toShorten(+obj?.change1h || 0))
  @Expose()
  change1hShorten = 0;

  change6h = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.change6h || 0),
  )
  @Expose()
  change6hReadable = 0;

  @Transform(({ obj }) => toShorten(+obj?.change6h || 0))
  @Expose()
  change6hShorten = 0;

  change24h = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.change24h || 0),
  )
  @Expose()
  change24hReadable = 0;

  @Transform(({ obj }) => toShorten(+obj?.change24h || 0))
  @Expose()
  change24hShorten = 0;

  volume1h = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.volume1h || 0),
  )
  @Expose()
  volume1hReadable = 0;

  @Transform(({ obj }) => toShorten(+obj?.volume1h || 0))
  @Expose()
  volume1hShorten = 0;

  volume6h = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.volume6h || 0),
  )
  @Expose()
  volume6hReadable = 0;

  @Transform(({ obj }) => toShorten(+obj?.volume6h || 0))
  @Expose()
  volume6hShorten = 0;

  volume24h = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.volume24h || 0),
  )
  @Expose()
  volume24hReadable = 0;

  @Transform(({ obj }) => toShorten(+obj?.volume24h || 0))
  @Expose()
  volume24hShorten = 0;

  tnx6h = 0;

  @Transform(({ obj }) => Intl.NumberFormat(undefined).format(+obj?.tnx6h || 0))
  @Expose()
  tnx6hReadable = 0;

  @Transform(({ obj }) => toShorten(+obj?.tnx6h || 0))
  @Expose()
  tnx6hShorten = 0;

  tnx24h = 0;

  @Transform(({ obj }) =>
    Intl.NumberFormat(undefined).format(+obj?.tnx24h || 0),
  )
  @Expose()
  tnx24hReadable = 0;

  @Transform(({ obj }) => toShorten(+obj?.tnx24h || 0))
  @Expose()
  tnx24hShorten = 0;

  links: any[];
}
