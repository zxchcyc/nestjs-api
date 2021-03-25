import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoModel } from '../../../../common';
import { ObjectID } from 'mongodb';

@Schema()
export class Title extends BaseMongoModel {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ default: '', trim: true })
  describe: string;

  // 上级岗位
  @Prop({ default: 'root', ref: 'title' })
  pid: ObjectID;
}

export const titleSchema = SchemaFactory.createForClass(Title);
