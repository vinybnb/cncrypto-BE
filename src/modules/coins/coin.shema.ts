import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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

  @Prop({ default: '' })
  descriptionCn: string;

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
  liquidityUsd: number;

  @Prop({ default: 0 })
  change1h: number;

  @Prop({ default: 0 })
  change6h: number;

  @Prop({ default: 0 })
  change24h: number;

  @Prop({ default: 0 })
  volume1h: number;

  @Prop({ default: 0 })
  volume6h: number;

  @Prop({ default: 0 })
  volume24h: number;

  @Prop({ default: 0 })
  tnx6h: number;

  @Prop({ default: 0 })
  tnx24h: number;

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
