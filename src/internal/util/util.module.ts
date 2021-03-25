import { Module, Global } from '@nestjs/common';
import { UtilService } from './util.service';

/**
 * 工具类模块
 */
@Global()
@Module({
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
