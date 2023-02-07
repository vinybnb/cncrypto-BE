import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Chain {
  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop({ name: 'currency_symbol' })
  currencySymbol: string;

  @Prop({ name: 'scan_key' })
  scanKey: string;

  @Prop({ name: 'scan_value' })
  scanValue: string;

  @Prop()
  slug: string;
}

export type ChainDocument = HydratedDocument<Chain>;

export const ChainSchema = SchemaFactory.createForClass(Chain);
