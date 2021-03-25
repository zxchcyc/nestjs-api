import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import { getNamespace } from 'cls-hooked';
import { EnvService } from '../../internal/env/env.service';
import { EHttpErrorCode, THttpResponse } from '..';

/**
 * 捕获 Mongoose Error、MongoError
 */
@Injectable()
@Catch(MongooseError, MongoError)
export class DatabaseErrorFilter implements ExceptionFilter {
  private logger: Logger = new Logger(DatabaseErrorFilter.name);
  constructor(private readonly envService: EnvService) {}
  async catch(exception: Error | MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errorMsg =
      exception instanceof MongoError ? exception.errmsg : exception.message;
    this.logger.warn(`Database Error! Request path: ${request.url}`);

    const responseJson: THttpResponse<string> = {
      errorCode: 'B0101',
      message: EHttpErrorCode['B0101'],
      error: errorMsg,
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
