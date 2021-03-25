import { Injectable } from '@nestjs/common';
import { EnvService } from '../../internal/env/env.service';
import { getNamespace } from 'cls-hooked';
import { HttpService } from '../http/http.service';

/**
 * webhook 服务类
 */
@Injectable()
export class WebhookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvService,
  ) {}

  /**
   * 发送警报至钉钉
   *
   * @param {string} message 警报消息
   * @param {string} [stack] 错误栈
   * @param {string} [uri] 请求来源url
   * @param {*} [reqData] 请求数据
   * @memberof WebhookService
   */
  async toDingDing(
    message: string,
    stack?: string,
    uri?: string,
    reqData?: any,
  ) {
    //if (this.envService.isProd()) {
    const traceID = getNamespace('create-nest-app').get('traceID');
    const markdown = {
      title: `【${this.envService.get('NODE_ENV')}】 ${this.envService.get(
        'SERVICE_NAME',
      )} 报错啦`,
      text: `### 【${this.envService.get('NODE_ENV')}】${this.envService.get(
        'SERVICE_NAME',
      )} \n #### 报错信息：\n > ${message} \n #### uri：\n > ${uri} \n #### 请求参数：\n > ${JSON.stringify(
        reqData,
      )} \n #### traceID为：\n > ${traceID} \n\n #### 错误栈： \n > ${stack}  `,
    };
    const data = {
      msgtype: 'markdown',
      markdown,
    };
    await this.httpService.dingRequest(data);
    //}
  }
}
