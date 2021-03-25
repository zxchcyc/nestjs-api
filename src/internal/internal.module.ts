import { Global, Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { I18nOptionsModule } from './i18n/i18n-options.module';
import { MyLoggerModule } from './logger/logger.module';
import { MongoModule } from './mongo/mongo.module';
import { MysqlModule } from './mysql/mysql.module';
import { OperationLogModule } from './op-logs/op-log.module';
import { QueuesModule } from './queues/queues.module';
import { IoRedisModule } from './redis/redis.module';
import { ThreadPoolModule } from './thread-pool/thread-pool.module';
import { MyTypeOrmModule } from './typeorm/typeorm.module';
import { UtilModule } from './util/util.module';

@Global()
@Module({
  imports: [
    EnvModule.register({ folder: process.env.CONFIG_FOLDER }),
    I18nOptionsModule,
    MyLoggerModule,
    MongoModule,
    // MysqlModule,
    OperationLogModule,
    QueuesModule,
    IoRedisModule,
    ThreadPoolModule,
    MyTypeOrmModule,
    UtilModule,
  ],
  exports: [
    EnvModule.register({ folder: process.env.CONFIG_FOLDER }),
    I18nOptionsModule,
    MyLoggerModule,
    MongoModule,
    // MysqlModule,
    OperationLogModule,
    QueuesModule,
    IoRedisModule,
    ThreadPoolModule,
    MyTypeOrmModule,
    UtilModule,
  ],
})
export class InternalModule {}
