/*
 * @Author: archer.zheng
 * @Date: 2020-07-27 11:04:10
 * @LastEditTime: 2021-03-24 16:15:15
 * @LastEditors: Please set LastEditors
 * @Description: 操作日志异步处理
 * @FilePath: /edc-api/src/internal/op-logs/op-log.processor.ts
 */
import {
  Process,
  Processor,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueRemoved,
  OnQueueError,
  OnQueueActive,
  OnQueueStalled,
  OnGlobalQueueError,
} from '@nestjs/bull';
import { Logger, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { OperationLogService } from '../op-logs/op-log.service';
import { prodProcess } from 'src/common';

@Injectable()
@Processor('op-log')
export class OplogProcessor {
  constructor(private readonly operationLogService: OperationLogService) {}

  private readonly logger = new Logger(OplogProcessor.name);

  @OnQueueRemoved()
  onRemoved(job: Job) {
    this.logger.debug('onRemoved');
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(error, 'OnQueueFailed');
  }

  @OnQueueError()
  onError(job: Job, error: Error) {
    this.logger.error(error, 'OnQueueError');
  }

  @OnGlobalQueueError()
  OnGlobalQueueError(job: Job, error: Error) {
    this.logger.error(error, 'OnGlobalQueueError');
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.debug('onCompleted');
  }

  @OnQueueActive()
  OnQueueActive(job: Job, result: any) {
    this.logger.debug('OnQueueActive');
  }

  @OnQueueStalled()
  nQueueStalled(job: Job, result: any) {
    this.logger.debug('OnQueueStalled');
  }

  @Process('oplogInsert')
  @prodProcess()
  async handleTranscode(job: Job) {
    // 需要结合功能权限体系
  }
}
