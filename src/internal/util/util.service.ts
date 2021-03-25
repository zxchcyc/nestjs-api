/*
 * @Author: archer.zheng
 * @Date: 2020-07-29 16:06:44
 * @LastEditTime: 2021-03-25 10:32:40
 * @LastEditors: Please set LastEditors
 * @Description: 系统工具类
 * @FilePath: /edc-api/src/internal/util/util.service.ts
 */
import { Logger, Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { EnvService } from 'src/internal/env/env.service';
import { NodeService } from './util-node.service';
import { SmoothWeightedRoundRobinService } from './util-weighted-polling.service';
import { CommonService } from './util-common.service';

/**
 * 工具类
 */
@Injectable()
export class UtilService {
  private logger: Logger = new Logger(UtilService.name);
  public Node = NodeService;
  public SmoothWeightedRoundRobin = SmoothWeightedRoundRobinService;
  public common = new CommonService();

  constructor(
    private readonly redisService: RedisService,
    private readonly envService: EnvService,
  ) {}

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
