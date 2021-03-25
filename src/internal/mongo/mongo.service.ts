/*
 * @Author: archer.zheng
 * @Date: 2020-12-22 17:34:05
 * @LastEditTime: 2021-03-25 10:20:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /edc-api/src/internal/mongo/mongo.service.ts
 */
import { Logger, Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import * as mongoose from 'mongoose';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

/**
 * mongo配置服务
 */
@Injectable()
export class MongoService implements MongooseOptionsFactory {
  private logger: Logger = new Logger(MongoService.name);

  constructor(private readonly envService: EnvService) {}

  createMongooseOptions(): MongooseModuleOptions {
    // 单体
    const uri: string = `mongodb://${this.envService.get(
      'MONGODB_USERNAME',
    )}:${this.envService.get('MONGODB_PASSWORD')}@${this.envService.get(
      'MONGODB_ENDPOINT',
    )}/${this.envService.get('MONGODB_DATABASE')}`;

    // 副本集
    // const uri: string = `mongodb+srv://${this.envService.get(
    //   'MONGODB_USERNAME',
    // )}:${this.envService.get('MONGODB_PASSWORD')}@${this.envService.get(
    //   'MONGODB_ENDPOINT',
    // )}/${this.envService.get('MONGODB_DATABASE')}`;

    // aliyun 副本集
    // const uri: string = `mongodb://${this.envService.get(
    //   'MONGODB_USERNAME',
    // )}:${this.envService.get('MONGODB_PASSWORD')}@${this.envService.get(
    //   'MONGODB_ENDPOINT',
    // )}/${this.envService.get(
    //   'MONGODB_DATABASE',
    // )}?replicaSet=${this.envService.get('MONGODB_RS')}`;

    this.logger.debug(uri);
    // 生产 log 可以关闭
    if (!this.envService.isProd()) {
      mongoose.set('debug', true);
    }

    mongoose.set('useFindAndModify', false);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useCreateIndex', true);

    return {
      uri,
      useNewUrlParser: true,
      poolSize: 10,
      socketTimeoutMS: 300000,
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          this.logger.log('Mongo connected');
          this.logger.log(uri);
        });

        connection.on('error', (error) => {
          this.logger.error(error);
        });

        connection.on('reconnected', () => {
          this.logger.log('Mongo re-connected');
          this.logger.log(uri);
        });

        connection.on('disconnected', () => {
          this.logger.error('Mongo disconnected');
        });

        return connection;
      },
    };
  }
}
