/*
 * @Author: archer.zheng
 * @Date: 2020-07-21 18:59:58
 * @LastEditTime: 2021-03-24 19:56:13
 * @LastEditors: Please set LastEditors
 * @Description: 环境变量获取
 * @FilePath: /edc-api/src/internal/env/env.service.ts
 */
import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'dotenv';
import { ENV_OPTIONS } from './constants';
import { EnvConfig, EnvOptions } from './interfaces';

@Injectable()
export class EnvService {
  private envConfig: EnvConfig;

  constructor(@Inject(ENV_OPTIONS) options: EnvOptions) {
    // if (process.env.NODE_ENV === 'dev') {
      // 配置文件路径
      const filePath = `.env.${
        process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'
      }`;
      let envFile: any;
      envFile = resolve(__dirname, '../../', options.folder, filePath);
      this.envConfig = parse(readFileSync(envFile));
    // } else {
      // this.envConfig = process.env;
    // }
  }

  /**
   * 获取配置
   * @param key
   * @param byEnv 是否由 node 的环境变量中获取
   * @param defaultVal 默认值
   */
  get(key: string, byNodeEnv: boolean = false, defaultVal?: any): string {
    return (byNodeEnv ? process.env[key] : this.envConfig[key]) || defaultVal;
  }

  /**
   * 开发环境
   */
  isDev(): boolean {
    return this.get('NODE_ENV', false) === 'dev';
  }

  /**
   * 生产环境
   */
  isProd(): boolean {
    return this.get('NODE_ENV', false) === 'prod';
  }
}
