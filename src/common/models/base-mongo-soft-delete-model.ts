import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoModel } from './base-mongo-model';
import { Types } from 'mongoose';

/**
 * mongo model 带软删除属性的基类
 */
@Schema()
export abstract class BaseMongoSoftDeleteModel extends BaseMongoModel {
  // 是否已被删除标志，删除：1，未删除：0
  @Prop({
    default: 0,
    // index: true,
  })
  isDeleted?: number;

  // 数据被删除的时间
  @Prop({
    default: null,
  })
  gmtDeleted?: Date;

  // 删除数据的人
  @Prop({
    default: null,
  })
  deletedBy?: Types.ObjectId;
}
