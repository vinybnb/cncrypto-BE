import { PresalePlatform } from '@modules/presale-flatform/presale-platform.shema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { LISTING_TYPE, STATUS } from './coin.enum';

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

  @Prop({ default: LISTING_TYPE.COIN })
  listingType: LISTING_TYPE;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  descriptionCn: string;

  @Prop({ default: STATUS.APPROVING })
  status: STATUS;

  @Prop({ default: false })
  premium: boolean;

  @Prop({ default: null })
  whitelistLink: string;

  @Prop({ default: null })
  whitelistAt: Date;

  @Prop({ default: null })
  launchAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PresalePlatform' })
  presalePlatform: PresalePlatform;

  @Prop({ default: null })
  presaleLink: string;

  @Prop({ default: null })
  presaleStartAt: Date;

  @Prop({ default: null })
  presaleEndAt: Date;

  @Prop({ default: null })
  presaleSoftCap: number;

  @Prop({ default: null })
  presaleHardCap: number;

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
