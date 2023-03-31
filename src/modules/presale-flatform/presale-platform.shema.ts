import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'presale-platform',
  timestamps: { createdAt: true, updatedAt: false },
})
export class PresalePlatform {
  @Prop()
  name: string;

  @Prop()
  logo: string;
}

export type PresalePlatformDocument = HydratedDocument<PresalePlatform>;

export const PresalePlatformSchema =
  SchemaFactory.createForClass(PresalePlatform);
