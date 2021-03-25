import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import {
  TraceIdMiddleware,
  ResTimeInterceptor,
  HttpExceptionFilter,
  DatabaseErrorFilter,
  AllExceptionFilter,
  ParameterValidationPipe,
} from './common';

import { ModulesModule } from './modules/modules.module';
import { TasksModule } from './tasks/tasks.module';
import { InternalModule } from './internal/internal.module';
import { ExternalModule } from './external/external.module';

@Module({
  imports: [
    // 外部模块加载
    ExternalModule,

    // 内部模块加载
    InternalModule,

    // 业务模块加载
    ModulesModule,

    // 任务模块加载
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  providers: [
    // 全局使用请求成功拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResTimeInterceptor,
    },
    // 全局捕获并处理 未知 异常
    // 先注册慢调用 这个顺序不能乱来
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    // 全局捕获并处理Http异常
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 全局捕获并处理 Mongoose 异常
    {
      provide: APP_FILTER,
      useClass: DatabaseErrorFilter,
    },
    // 全局使用参数校验 Pipe
    {
      provide: APP_PIPE,

      // 定制参数校验器
      useFactory: () =>
        new ParameterValidationPipe({
          transform: true,

          // 只有添加了验证装饰器的属性才能被定义 其他被过滤掉
          whitelist: true,
          validationError: {
            // 这两个属性不暴露
            target: false,
            value: false,
          },
        }),
      inject: [],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
