/*
 * @Author: archer.zheng
 * @Date: 2020-07-29 16:06:44
 * @LastEditTime: 2021-03-25 10:31:25
 * @LastEditors: Please set LastEditors
 * @Description: 通用工具类
 * @FilePath: /edc-api/src/internal/util/util-weighted-polling.service.ts
 */
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  private logger: Logger = new Logger(CommonService.name);

  constructor() {}

  /**
   * 列表时间筛选格式化
   * @param startTime 开始时间 前端进来是字符串
   * @param endTime 结束时间 前端进来是字符串
   * @param filters 过滤条件对象
   * @returns
   *    filters 挂载好的时间过滤条件
   */
  public listTimeFormat(
    startTime: string | number,
    endTime: string | number,
    filters: any,
  ) {
    if (startTime && endTime) {
      filters.gmtCreate = {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      };
    } else if (startTime && !endTime) {
      filters.gmtCreate = {
        $gte: new Date(startTime),
      };
    } else if (!startTime && endTime) {
      filters.gmtCreate = {
        $lte: new Date(endTime),
      };
    }

    return filters;
  }
}
