import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLE } from '@common/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ default: '' })
  name: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: ROLE.MEMBER })
  role: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
