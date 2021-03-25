/*
 * @Author: archer.zheng
 * @Date: 2020-08-14 11:41:17
 * @LastEditTime: 2021-03-23 19:36:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /edc-api/src/internal/queues/queues.module.ts
 */
import { BullModule } from '@nestjs/bull';
import { Logger, Module, Global } from '@nestjs/common';
import { BullConfigService } from './bull-config.service';
const logger: Logger = new Logger('queues.module');

const BullQueueModule = BullModule.registerQueueAsync(
  {
    name: 'op-log',
    useClass: BullConfigService,
  },
);

@Global()
@Module({
  imports: [BullQueueModule],
  exports: [BullQueueModule],
})
export class QueuesModule {}
