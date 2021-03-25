/*
 * @Author: archer zheng 
 * @Date: 2020-09-01 10:05:27
 * @LastEditTime: 2020-09-01 10:30:43
 * @LastEditors: Please set LastEditors
 * @Description: websocket client 服务模块
 * @FilePath: /edc-api/src/external/websocket/websocket.module.ts
 */
import { Module, Global } from '@nestjs/common';
import { WebsocketService } from './websocket.service';

@Global()
@Module({
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
