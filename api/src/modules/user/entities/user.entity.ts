import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { Exclude } from 'class-transformer';

@Schema({ timestamps: true })
class User extends Document {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  // @Exclude()
  @Prop({ required: true })
  masterPassword: string;

  // @Exclude()
  @Prop()
  currentHashedRefreshToken?: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema, User };
