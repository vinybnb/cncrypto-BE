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
  chainId: string;

  @Prop({ name: 'contract_address', default: null })
  contractAddress: string;

  // @Prop({
  //   type: [
  //     {
  //       chain: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: 'Chain',
  //       },
  //       contractAddress: String,
  //     },
  //   ],
  //   default: [],
  // })
  // chains: {
  //   chain: Chain;
  //   contractAddress: string;
  // }[];

  @Prop({ default: '' })
  description: string;

  @Prop()
  links: {
    name: string;
    link: string;
  }[];

  // @Prop({ name: 'description_cn', default: '' })
  // descriptionCn: string;

  @Prop({ name: 'whitelist_link', default: null })
  whitelistLink: string;

  @Prop({ name: 'launch_date', default: null })
  launchDate: Date;

  @Prop({ name: 'presale_link', default: null })
  presaleLink: string;

  @Prop({ name: 'presale_platform', default: null })
  presalePlatform: string;

  @Prop({ name: 'presale_time', default: null })
  presaleTime: Date;

  @Prop({ name: 'approved_at', default: null })
  approvedAt: Date;

  @Prop({ name: 'total_votes', default: 0 })
  totalVotes: number;

  @Prop({ name: 'price', default: 0 })
  price: number;

  @Prop({ name: 'marketcap', default: 0 })
  marketcap: number;

  @Prop({ name: 'liquidity', default: 0 })
  liquidity: number;

  @Prop({ default: STATUS.APPROVING })
  status: STATUS;
  
  @Prop({ name: 'h1', default: 0 })
  h1: number;
  
  @Prop({ name: 'h6', default: 0 })
  h6: number;
  
  @Prop({ name: 'h24', default: 0 })
  h24: number;
  
  @Prop({ name: 'tnx_6', default: 0 })
  tnx_6: number;
  
  @Prop({ name: 'tnx_24', default: 0 })
  tnx_24: number;

}

export type CoinDocument = HydratedDocument<Coin>;

export const CoinSchema = SchemaFactory.createForClass(Coin);

CoinSchema.set('toObject', { virtuals: true });
CoinSchema.set('toJSON', { virtuals: true });
