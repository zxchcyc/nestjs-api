import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  Logger,
} from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import { EnvService } from '../../internal/env/env.service';

import { EHttpErrorCode, THttpResponse } from '..';

/**
 * 捕获全局异常 注意加载顺序 最先加载最后执行
 */
@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(AllExceptionFilter.name);
  constructor(private readonly envService: EnvService) {}
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    this.logger.warn(`未知错误! Request path: ${request.url}`);

    const responseJson: THttpResponse<string> = {
      errorCode: 'B0001',
      message: EHttpErrorCode['B0001'],
      error: exception.message,
      stack: exception.stack,
      traceId: getNamespace('create-nest-app').get('traceID'),
    };
    this.logger.error(responseJson);

    if (this.envService.isProd()) {
      delete responseJson.error;
      delete responseJson.stack;
    }

    // 事务 session 释放
    const session = getNamespace('create-nest-app').get('session');
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    response.status(500).json(responseJson);
  }
}
