import { MyHttpModule } from './../http/http.module';
import { Module, Global,  } from '@nestjs/common';
import { WebhookService } from './webhook.service';

/**
 * webhook 服务模块
 */
@Global()
@Module({
  imports: [MyHttpModule],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
