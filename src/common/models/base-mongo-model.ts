import { Types, Document } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';

/**
 * mongo model 基类
 */
@Schema()
export abstract class BaseMongoModel extends Document {
  _id: Types.ObjectId;

  @Prop({
    default: null,
    index: true,
  })
  gmtCreate: Date;

  @Prop({
    default: null,
    index: true,
  })
  gmModified: Date;

  @Prop({
    default: null,
    index: true,
  })
  createBy?: Types.ObjectId;

  @Prop({
    default: null,
    index: true,
  })
  modifiedBy?: Types.ObjectId;
}
