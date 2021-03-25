import { Module, Global } from '@nestjs/common';
import { OperationLogService } from './op-log.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OperationLog, operationLogSchema } from './schemas/op-log.schema';
import { OplogProcessor } from '../op-logs/op-log.processor';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: OperationLog.name,
          schema: operationLogSchema,
          collection: 'operationlogs',
        },
      ],
      'default',
    ),
  ],
  providers: [OperationLogService, OplogProcessor],
  exports: [OperationLogService],
})
export class OperationLogModule {}
