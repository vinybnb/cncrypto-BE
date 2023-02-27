import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chain } from '@modules/chains/coin.shema';
import { STATUS } from './coin.enum';

@Schema({ timestamps: true })
export class Coin {
  @Prop({ type: Number })
  id: number;

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  logo: string;

  @Prop({
    type: [
      {
        chainId: Number,
        contractAddress: String,
        pairAddress: String,
      },
    ],
    default: [],
  })
  chains: {
    chainId: number;
    contractAddress: string;
    pairAddress: string;
  }[];

  @Prop({ default: null })
  contractAddress: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: STATUS.APPROVING })
  status: STATUS;

  @Prop({ default: null })
  whitelistLink: string;

  @Prop({ default: null })
  whitelistAt: Date;

  @Prop({ default: null })
  launchAt: Date;

  @Prop({ default: null })
  preSaleLink: string;

  @Prop({ default: null })
  preSalePlatform: string;

  @Prop({ default: null })
  preSaleAt: Date;

  // this will create a virtual property called 'fullName'
  @Prop({ virtual: true, type: String })
  get preSalePeriod() {
    return `${this.preSaleAt}`;
  }

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

  @Prop({
    type: [
      {
        name: String,
        link: String,
        socialCount: Number,
      },
    ],
    default: [],
  })
  links: {
    name: string;
    link: string;
    socialCount: string;
  }[];
}

export type CoinDocument = HydratedDocument<Coin>;

export const CoinSchema = SchemaFactory.createForClass(Coin);

CoinSchema.set('toObject', { virtuals: true });
CoinSchema.set('toJSON', { virtuals: true });
