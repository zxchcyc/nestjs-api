import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OperationLog } from './schemas/op-log.schema';
import { BaseMongoService } from 'src/common';

@Injectable()
export class OperationLogService extends BaseMongoService<OperationLog> {
  constructor(
    @InjectModel(OperationLog.name)
    private readonly operationLogModel: Model<OperationLog>,
  ) {
    super(operationLogModel, OperationLog.name);
  }
}
