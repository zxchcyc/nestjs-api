/*
 * @Author: archer zheng
 * @Date: 2020-12-18 15:43:30
 * @LastEditTime: 2020-12-18 17:20:12
 * @LastEditors: Please set LastEditors
 * @Description: 线程池支持
 * @FilePath: /edc-api/src/internal/thread-pool/thread-pool.service.ts
 */

import { Injectable, Logger } from '@nestjs/common';
const Piscina = require('piscina');

@Injectable()
export class ThreadPoolService {
  private readonly logger: Logger = new Logger(ThreadPoolService.name);
  private readonly piscina = new Piscina({});
  constructor() {}

  /**
   * 启动工作线程
   * @param {string} filename 工作线程文件路径
   * @param {object} transferList postMessage 参数
   *
   */
  async runTask(filename: string, transferList: object = {}) {
    try {
      this.logger.debug(filename);
      // this.logger.debug(transferList);
      return this.piscina.runTask(transferList, filename);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
