import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoModel } from '../../../common';

@Schema()
export class OperationLog extends BaseMongoModel {
  // 登录账号
  @Prop({ required: true, trim: true, index: true })
  account: string;

  // 账号名称
  @Prop({ required: true, trim: true, index: true })
  name: string;

  // 操作目录
  @Prop({ required: true, trim: true, index: true })
  module: string;

  // 操作类型
  @Prop({ required: true, trim: true, index: true })
  action: string;

  // 操作内容
  @Prop({ required: true, trim: true })
  describe: string;

  // 操作时间
  @Prop({
    default: new Date(),
  })
  time: Date;

  // 操作类型
  @Prop({ default: '', trim: true })
  jobId: string;

  @Prop({ default: '', trim: true })
  ip: string;
}

export const operationLogSchema = SchemaFactory.createForClass(OperationLog);
