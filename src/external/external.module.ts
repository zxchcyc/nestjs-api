import { Global, Module } from '@nestjs/common';
import { MyHttpModule } from './http/http.module';
import { WebhookModule } from './webhook/webhook.module';
import { WebsocketModule } from './websocket/websocket.module';

@Global()
@Module({
  imports: [
    MyHttpModule,
    WebhookModule,
    // WebsocketModule,
  ],
  exports: [
    MyHttpModule,
    WebhookModule,
    // WebsocketModule,
  ],
})
export class ExternalModule {}
