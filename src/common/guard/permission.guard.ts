/*
 * @Author: archer zheng
 * @Date: 2020-07-27 11:04:10
 * @LastEditTime: 2021-03-24 18:41:41
 * @LastEditors: Please set LastEditors
 * @Description: 权限守卫
 * @FilePath: /edc-api/src/common/guard/permission.guard.ts
 */
import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ObjectID } from 'mongodb';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { OperationLogService } from '../../internal/op-logs/op-log.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { getNamespace } from 'cls-hooked';
import { setQueues } from 'bull-board';

@Injectable()
export class PermissionGuard implements CanActivate {
  private logger: Logger = new Logger(PermissionGuard.name);

  constructor(
    @InjectConnection('default') private connection: Connection,
    private readonly operationLogService: OperationLogService,
    @InjectQueue('op-log') private opLogQueue: Queue,
  ) {
    setQueues([opLogQueue]);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user || !request.path) {
      return false;
    }
    // 从请求提取权限标识
    let uri: string = request.path;

    // 基于 restful 把参数id 过滤掉
    if (request.params.id) {
      uri = uri.replace(`/${request.params.id}`, '');
    }

    // 请求方法小写 配置时候用小写
    uri = uri + '/' + request.method.toLowerCase();

    // 把第一个 / 去掉
    uri = uri.substr(1);

    // this.logger.debug(uri);

    // 交叉权限处理
    // 需要交叉的 URI
    const crossList = [];
    let needCross = crossList.find((element) => {
      return element === uri;
    });

    this.logger.debug(needCross);
    this.logger.debug(request.body.cross);
    if (needCross && (request.body.cross || request.query.cross)) {
      // 如果这个 URI 需要交叉, body 带上交叉标识即可
      return true;
    }

    return true;
  }
}
