import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Account extends Document {
  @Prop({ required: true })
  subdomain: string;
  @Prop({ required: true })
  name: string;
  @Prop({ type: mongoose.Schema.Types.Buffer, required: true })
  secret: Buffer;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
