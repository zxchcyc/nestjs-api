declare const module: any;

import { install } from 'source-map-support';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './internal/logger/logger.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  install();

  // 扩展自定义日志
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(LoggerService));

  // 跨域配置
  app.enableCors();

  // 配置全局根路由
  app.setGlobalPrefix('api');

  // 配置 Swagger API 文档
  const options = new DocumentBuilder()
    .setTitle('EDC API')
    .setDescription('EDC API')
    .setVersion('V1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const logger = new Logger('bootstrap');
  await app.listen(process.env.PORT, () =>
    logger.log(
      `Swagger API Docs started on: http://localhost:${process.env.PORT}/docs/`,
    ),
  );

  // webpack 热加载
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  process.on('unhandledRejection', (reason: Error, promise) => {
    if (!(reason instanceof Error)) {
      reason = new Error(reason);
    }
    const errorJson = {
      message: `unhandledRejection: ${reason.message}`,
      stack: reason.stack,
      promise: promise,
    };
    logger.error(errorJson);
  });

  process.on('uncaughtException', (error: Error) => {
    const errorJson = {
      message: `uncaughtException: ${error.message}`,
      stack: error.stack,
    };
    logger.error(errorJson);
  });
}

bootstrap();
