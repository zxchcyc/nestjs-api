/*
 * @Author: archer zheng
 * @Date: 2020-09-01 10:05:27
 * @LastEditTime: 2021-03-24 16:27:41
 * @LastEditors: Please set LastEditors
 * @Description: websocket client 服务类
 * @FilePath: /edc-api/src/external/websocket/websocket.service.ts
 */
import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../../internal/env/env.service';
import * as io from 'socket.io-client';

interface IWebsocketSendMessageBody {
  // 'All' 全局广播
  // 'Authenticated' 发送给已登录用户
  // ['userId'] 指定发送给某些用户
  sendTo: string[] | string;
  // 二级事件
  tag?: string;
  data: Object;
}

@Injectable()
export class WebsocketService {
  private readonly socket = io(
    `${this.envService.get('WS_API')}?token=${this.envService.get(
      'EDC-API-WS-KEY',
    )}`,
  );
  private readonly logger: Logger = new Logger(WebsocketService.name);
  constructor(private readonly envService: EnvService) {
    this.socket.on('connect', () => {
      this.logger.debug('WebsocketService Connected');
    });
    // this.socket.on('events', (data) => {
    //   this.logger.debug(data);
    // });
    this.socket.on('disconnect', () => {
      this.logger.debug('WebsocketService Disconnected');
    });
  }

  /**
   * 发送 websocket 消息
   *
   * @param {string} event 事件名
   * @param {Object} IWebsocketSendMessageBody 发送的数据
   * @param {Function} ack 接收者响应
   */
  async emit(event: string, data: IWebsocketSendMessageBody, ack?: Function) {
    try {
      // 注意两者接收的方式不一样
      if (ack) {
        this.socket.emit(event, data, ack);
      } else {
        this.socket.emit(event, data);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * 发送 websocket 'events' 这个事件的消息
   *
   * @param {string} tag 二级事件名
   * @param {Object} IWebsocketSendMessageBody 发送的数据
   * @param {Function} ack 接收者响应
   */
  async emitEventsTag(
    tag: string,
    data: IWebsocketSendMessageBody,
    ack?: Function,
  ) {
    this.logger.debug(tag);
    this.logger.debug(data);
    this.emit('events', { ...data, tag }, ack);
  }
}
