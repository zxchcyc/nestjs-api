/*
 * @Author: archer zheng
 * @Date: 2020-12-18 15:43:30
 * @LastEditTime: 2020-12-18 15:46:10
 * @LastEditors: Please set LastEditors
 * @Description: 线程池支持
 * @FilePath: /edc-api/src/internal/thread-pool/thread-pool.module.ts
 */

import { Module, Global } from '@nestjs/common';
import { ThreadPoolService } from './thread-pool.service';

@Global()
@Module({
  providers: [ThreadPoolService],
  exports: [ThreadPoolService],
})
export class ThreadPoolModule {}
