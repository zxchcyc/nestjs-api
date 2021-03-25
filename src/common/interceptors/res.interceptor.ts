/*
 * @Author: archer zheng
 * @Date: 2020-07-23 17:28:20
 * @LastEditTime: 2021-03-25 15:00:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /edc-api/src/common/interceptors/res.interceptor.ts
 */
import {
  Logger,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { tap, map, timeout, catchError } from 'rxjs/operators';
import { EHttpErrorCode, THttpResponse } from '../../common';
import { getNamespace } from 'cls-hooked';

/**
 * 拦截器, 打印请求耗时, 可以加慢请求监控
 * 返回数据格式统一 业务逻辑异常在这里处理
 */
@Injectable()
export class ResTimeInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(ResTimeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const reqInTime: number = Date.now();
    this.logger.log(`请求经过全局拦截器: ${new Date(reqInTime).toISOString()}`);
    this.logger.debug(`request.path:`);
    this.logger.debug(request.path);
    this.logger.debug(`request.body:`);
    this.logger.debug(request.body);
    this.logger.debug(`request.query:`);
    this.logger.debug(request.query);
    this.logger.debug(`request.params:`);
    this.logger.debug(request.params);

    return next
      .handle()
      .pipe(tap(() => this.logger.log(`请求结束: ${Date.now() - reqInTime}ms`)))
      .pipe(
        map(
          (data): THttpResponse<any> => {
            let errorCode = data.errorCode ? data.errorCode : '00000';
            return {
              errorCode: errorCode,
              message: EHttpErrorCode[errorCode],
              result: data.result,
              traceId: getNamespace('create-nest-app').get('traceID'),
            };
          },
        ),
      )
      .pipe(
        timeout(300 * 1000),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(error);
        }),
      );
  }
}
