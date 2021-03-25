/*
 * @Author: archer.zheng
 * @Date: 2020-06-18 16:45:01
 * @LastEditTime: 2021-03-24 19:52:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new-edt-api/src/internal/mysql/mysql.service.ts
 */
import { Logger, Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import {
  SequelizeOptionsFactory,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';
import { Config } from 'sequelize/types';

/**
 * mysql 配置服务
 */
@Injectable()
export class MysqlService implements SequelizeOptionsFactory {
  private logger: Logger = new Logger(MysqlService.name);

  constructor(private readonly envService: EnvService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialectOptions: {
        options: {
          requestTimeout: 300 * 1000,
        },
      },
      pool: {
        acquire: 60 * 1000,
        idle: 2000 * 1000,
      },
      // sql server 用这个
      // dialect: 'mssql',
      dialect: 'mysql',
      host: this.envService.get('MYSQL_HOST'),
      port: Number(this.envService.get('MYSQL_PORT')),
      username: this.envService.get('MYSQL_USERNAME'),
      password: this.envService.get('MYSQL_PASSWORD'),
      database: this.envService.get('MYSQL_DATABASE'),
      models: [],
      autoLoadModels: true,
      // 这个参数有点危险 慎用
      // synchronize: true,
      // 生成 log 可以关闭
      // logging: !this.envService.isProd(),
      // 使用本地 logger
      logging: (sql) => {
        if (!this.envService.isProd()) {
          this.logger.log(sql);
        }
      },
      hooks: {
        afterConnect: (connection: unknown, config: Config) => {
          this.logger.debug('sql server connected');
          // this.logger.debug(config);
        },
      },
    };
  }
}
