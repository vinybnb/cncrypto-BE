import { Coin } from '@modules/coins/coin.shema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'promote-coin',
  timestamps: { createdAt: true, updatedAt: false },
})
export class PromoteCoin {
  @Prop()
  startAt: Date;

  @Prop()
  expiredAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coin' })
  coin: Coin;
}

export type PromoteCoinDocument = HydratedDocument<PromoteCoin>;

export const PromoteCoinSchema = SchemaFactory.createForClass(PromoteCoin);
