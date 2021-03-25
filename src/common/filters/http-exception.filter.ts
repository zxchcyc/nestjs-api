import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import { EnvService } from '../../internal/env/env.service';
import { IExceptionResponse, EHttpErrorCode, THttpResponse } from '..';

/**
 * 捕获 HttpException,包括继承于它的 Exception
 */
@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(HttpExceptionFilter.name);
  constructor(private readonly envService: EnvService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    this.logger.warn(`Catch ${exception.name}! Request path: ${request.url}`);

    const exceptionResponse = exception.getResponse() as IExceptionResponse;

    const responseJson: THttpResponse<string> = {
      errorCode: exceptionResponse.error || exceptionResponse.errorCode,
      message: !exceptionResponse.isNotEnumMsg
        ? EHttpErrorCode[exceptionResponse.error || exceptionResponse.errorCode]
        : exceptionResponse.message,
      error: exceptionResponse.message,
      stack: exception.stack,
      traceId: getNamespace('create-nest-app').get('traceID'),
    };

    switch (exception.message) {
      case 'Unauthorized':
        responseJson.errorCode = 'A0106';
        responseJson.message = EHttpErrorCode['A0106'];
        break;
      case 'Request Timeout':
        responseJson.errorCode = 'B0103';
        responseJson.message = EHttpErrorCode['B0103'];
        break;
      default:
        break;
    }

    switch (exceptionResponse.error) {
      case 'Not Found':
        responseJson.errorCode = 'B0102';
        responseJson.message = EHttpErrorCode['B0102'];
        break;
      case 'Forbidden':
        responseJson.errorCode = 'A0102';
        responseJson.message = EHttpErrorCode['A0102'];
        break;
      case 'Bad Request':
        responseJson.errorCode = responseJson.error;
        responseJson.message = EHttpErrorCode[responseJson.error];
        break;
      default:
        break;
    }

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

    response.status(status).json(responseJson);
  }
}
