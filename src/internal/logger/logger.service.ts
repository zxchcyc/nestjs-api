/*
 * @Author: archer zheng
 * @Date: 2020-08-04 11:37:19
 * @LastEditTime: 2021-03-23 20:00:45
 * @LastEditors: Please set LastEditors
 * @Description: 自定义 logger 扩展 nestjs 自带 logger
 * @FilePath: /edc-api/src/internal/logger/logger.service.ts
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import { WebhookService } from '../../external/webhook/webhook.service';

@Injectable()
export class LoggerService extends Logger {
  @Inject()
  protected readonly webhookService: WebhookService;
  constructor() {
    super();
  }

  log(message: any, context?: string) {
    const traceID = getNamespace('create-nest-app').get('traceID');
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.log(
        message,
        traceID ? `${traceID} ${context}` : `system ${context}`,
      );
    } else {
      super.log(message, traceID ? `${traceID}` : `system`);
    }
  }

  error(message: any, trace?: string, context?: string) {
    const traceID = getNamespace('create-nest-app').get('traceID');
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.error(
        message,
        trace,
        traceID ? `${traceID} ${context}` : `system ${context}`,
      );
    } else {
      super.error(message, trace, traceID ? `${traceID}` : `system`);
    }
  }

  warn(message: any, context?: string) {
    const traceID = getNamespace('create-nest-app').get('traceID');
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.warn(
        message,
        traceID ? `${traceID} ${context}` : `system ${context}`,
      );
    } else {
      super.warn(message, traceID ? `${traceID}` : `system`);
    }
  }

  debug(message: any, context?: string) {
    const traceID = getNamespace('create-nest-app').get('traceID');
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.debug(
        message,
        traceID ? `${traceID} ${context}` : `system ${context}`,
      );
    } else {
      super.debug(message, traceID ? `${traceID}` : `system`);
    }
  }
  
  verbose(message: any, context?: string) {
    const traceID = getNamespace('create-nest-app').get('traceID');
    if (!context) {
      context = this.context;
    }
    if (context) {
      super.verbose(
        message,
        traceID ? `${traceID} ${context}` : `system ${context}`,
      );
    } else {
      super.verbose(message, traceID ? `${traceID}` : `system`);
    }
  }
}
