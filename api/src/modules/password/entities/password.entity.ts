import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Folder } from 'src/modules/folder/entities/folder.entity';
import { Exclude } from 'class-transformer';

@Schema({ timestamps: true })
export class Password extends Document {
  @Exclude()
  @Prop({ required: true })
  password: string;

  @Exclude()
  @Prop({ type: mongoose.Schema.Types.Buffer, required: true })
  iv: Buffer;

  @Prop(
    raw({
      priority: {
        type: Number,
        default: 0,
      },
      name: {
        type: String,
        required: true,
      },
    }),
  )
  metadata: Record<string, any>;

  @Exclude()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' })
  folder: Folder;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);
