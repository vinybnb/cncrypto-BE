import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BannerPlacement } from './types/enum';

@Schema({
  collection: 'promote-banner',
  timestamps: { createdAt: true, updatedAt: false },
})
export class PromoteBanner {
  @Prop()
  link: string;

  @Prop()
  imageUrl: string;

  @Prop()
  placement: BannerPlacement;

  @Prop()
  expiredAt: Date;
}

export type PromoteBannerDocument = HydratedDocument<PromoteBanner>;

export const PromoteBannerSchema = SchemaFactory.createForClass(PromoteBanner);
