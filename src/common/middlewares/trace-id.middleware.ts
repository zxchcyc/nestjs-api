/**
 * traceId middleware.
 * https://itnext.io/nodejs-logging-made-right-117a19e8b4ce
 * https://www.zcfy.cc/article/nodejs-logging-made-right
 * @author archer.zheng
 */

import { Request, Response } from 'express';
import { Logger, Injectable, NestMiddleware } from '@nestjs/common';
import { createNamespace } from 'cls-hooked';
import { v4 as uuidv4 } from 'uuid';
const clsNamespace = createNamespace('create-nest-app');
// import { InjectConnection } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';

/**
 * 用于全局挂载 traceId
 */
@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  // constructor(@InjectConnection('default') private connection: Connection) {}

  use(request: Request, response: Response, next) {
    clsNamespace.bindEmitter(request);
    clsNamespace.bindEmitter(response);
    // 前端传过来也可以
    const traceID = uuidv4();
    clsNamespace.run(() => {
      clsNamespace.set('traceID', traceID);
      // clsNamespace.set('connection', this.connection);
      Logger.log('trace-id.middleware', traceID);
      return next();
    });
  }
}
