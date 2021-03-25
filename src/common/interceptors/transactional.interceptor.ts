import {
  Logger,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getNamespace } from 'cls-hooked';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * 拦截器, mongo 事务封装
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(TransactionInterceptor.name);
  constructor(@InjectConnection('default') private connection: Connection) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (getNamespace('create-nest-app').get('session')) {
      throw new Error('请不要嵌套使用事务');
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    getNamespace('create-nest-app').set('session', session);
    return next.handle().pipe(
      tap(async () => {
        try {
          // Since the mutations ran without an error, commit the transaction.
          await session.commitTransaction();
        } catch (error) {
          // Abort the transaction as an error has occurred in the mutations above.
          this.logger.error(error);
          await session.abortTransaction();
          // Rethrow the error to be caught by the caller.
          throw error;
        } finally {
          // End the previous session.
          session.endSession();
        }
      }),
    );
  }
}
