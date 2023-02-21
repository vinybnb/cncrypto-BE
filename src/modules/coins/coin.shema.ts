import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chain } from '@modules/chains/coin.shema';
import { STATUS } from './coin.enum';

@Schema({ timestamps: true })
export class Coin {
  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  logo: string;

  @Prop({ default: null })
  chainId: number;

  // @Prop({ virtual: {ref: 'chain'} })
  // chain: number;

  @Prop({ default: null })
  contractAddress: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: STATUS.APPROVING })
  status: STATUS;

  @Prop({ default: null })
  whitelistLink: string;

  @Prop({ default: null })
  launchDate: Date;

  @Prop({ default: null })
  preSaleLink: string;

  @Prop({ default: null })
  preSalePlatform: string;

  @Prop({ default: null })
  preSaleTime: Date;

  @Prop({ default: null })
  approvedAt: Date;

  @Prop({ default: 0 })
  totalVotes: number;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  marketCap: number;

  @Prop({ default: 0 })
  liquidity: number;

  @Prop({ default: 0 })
  h1: number;

  @Prop({ default: 0 })
  h6: number;

  @Prop({ default: 0 })
  h24: number;

  @Prop({ default: 0 })
  tnx6: number;

  @Prop({ default: 0 })
  tnx24: number;

  @Prop({ default: '' })
  linkWebsite: string;

  @Prop({ default: '' })
  linkTelegram: string;

  @Prop({ default: '' })
  linkTwitter: string;

  @Prop({ default: '' })
  linkDiscord: string;

  @Prop({ default: '' })
  linkMedium: string;
}

export type CoinDocument = HydratedDocument<Coin>;

export const CoinSchema = SchemaFactory.createForClass(Coin);

// CoinSchema.virtual('chain', {
//   ref: 'chains',
//   localField: 'chainId',
//   foreignField: 'scanValue',
//   justOne: true,
// });

// CoinSchema.virtual('chain124').get((coin) => {
//   return 123;
// });

CoinSchema.set('toObject', { virtuals: true });
CoinSchema.set('toJSON', { virtuals: true });
