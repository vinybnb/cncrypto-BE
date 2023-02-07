import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chain } from 'src/chains/coin.shema';
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

  @Prop({
    type: [
      {
        chain: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chain',
        },
        contractAddress: String,
      },
    ],
    default: [],
  })
  chains: {
    chain: Chain;
    contractAddress: string;
  }[];

  @Prop({ default: '' })
  description: string;

  @Prop({ name: 'description_cn', default: '' })
  descriptionCn: string;

  @Prop({ name: 'whitelist_link', default: '' })
  whitelistLink: string;

  @Prop({ name: 'launch_date', default: '' })
  launchDate: string;

  @Prop({ name: 'launch_time', default: '' })
  launchTime: string;

  @Prop({ name: 'presale_link', default: '' })
  presaleLink: string;

  @Prop({ name: 'presale_platform', default: '' })
  presalePlatform: string;

  @Prop({ name: 'presale_time', default: null })
  presaleTime?: Date;

  @Prop({ name: 'approved_at', default: null })
  approvedAt: Date;

  @Prop({ name: 'total_votes', default: 0 })
  totalVotes: number;

  @Prop({ default: STATUS.APPROVING })
  status: STATUS;

  @Prop()
  links: {
    name: string;
    link: string;
  }[];
}

export type CoinDocument = HydratedDocument<Coin>;

export const CoinSchema = SchemaFactory.createForClass(Coin);

CoinSchema.virtual('chain124').get(() => {
  return 123;
});

CoinSchema.set('toObject', { virtuals: true });
CoinSchema.set('toJSON', { virtuals: true });
