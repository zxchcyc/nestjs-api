import { Module, Global } from '@nestjs/common';
import { HttpService } from './http.service';

/**
 * http服务模块
 */
@Global()
@Module({
  providers: [HttpService],
  exports: [HttpService],
})
export class MyHttpModule {}
