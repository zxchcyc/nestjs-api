import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    // 支持多库配置
    MongooseModule.forRootAsync({
      connectionName: 'default',
      useClass: MongoService,
    }),
  ],
})
export class MongoModule {}
