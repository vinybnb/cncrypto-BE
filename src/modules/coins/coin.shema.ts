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

  @Prop({ name: 'chain_id', default: null })
  chainId: number;

  @Prop({ name: 'contract_address', default: null })
  contractAddress: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: STATUS.APPROVING })
  status: STATUS;

  @Prop({ name: 'whitelist_link', default: null })
  whitelistLink: string;

  @Prop({ name: 'launch_date', default: null })
  launchDate: Date;

  @Prop({ name: 'presale_link', default: null })
  preSaleLink: string;

  @Prop({ name: 'presale_platform', default: null })
  preSalePlatform: string;

  @Prop({ name: 'presale_time', default: null })
  preSaleTime: Date;

  @Prop({ name: 'approved_at', default: null })
  approvedAt: Date;

  @Prop({ name: 'total_votes', default: 0 })
  totalVotes: number;

  @Prop({ name: 'price', default: 0 })
  price: number;

  @Prop({ name: 'marketcap', default: 0 })
  marketCap: number;

  @Prop({ name: 'liquidity', default: 0 })
  liquidity: number;

  @Prop({ name: 'h1', default: 0 })
  h1: number;
  
  @Prop({ name: 'h6', default: 0 })
  h6: number;
  
  @Prop({ name: 'h24', default: 0 })
  h24: number;
  
  @Prop({ name: 'tnx_6', default: 0 })
  tnx6: number;
  
  @Prop({ name: 'tnx_24', default: 0 })
  tnx24: number;

  @Prop({ name: 'link_website', default: '' })
  linkWebsite: string;

  @Prop({ name: 'link_telegram', default: '' })
  linkTelegram: string;

  @Prop({ name: 'link_twitter', default: '' })
  linkTwitter: string;

  @Prop({ name: 'link_discord', default: '' })
  linkDiscord: string;

  @Prop({ name: 'link_medium', default: '' })
  linkMedium: string;

}

export type CoinDocument = HydratedDocument<Coin>;

export const CoinSchema = SchemaFactory.createForClass(Coin);

CoinSchema.set('toObject', { virtuals: true });
CoinSchema.set('toJSON', { virtuals: true });
