// TODO: Make this entity model paginated
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { Exclude } from 'class-transformer';
// import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: true })
class Folder extends Document {
  @Prop({required: true, unique: true})
  name: string;

  @Prop()
  description: string;

  // TODO: Link to the Password entity
  // @Prop({ required: true})
  // passwords: [Password];
}

const FolderSchema = SchemaFactory.createForClass(Folder);

export { FolderSchema, Folder };
