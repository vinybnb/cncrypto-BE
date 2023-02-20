import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coin } from '@/modules/coins/coin.shema';

@Schema({ collection: 'promoted_list', timestamps: { createdAt: true } })
export class PromotedList {
  @Prop()
  startTime: Date;

  @Prop()
  expiredTime: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coin' })
  coin: Coin;
}

export type PromotedListDocument = HydratedDocument<PromotedList>;

export const PromotedListSchema = SchemaFactory.createForClass(PromotedList);
