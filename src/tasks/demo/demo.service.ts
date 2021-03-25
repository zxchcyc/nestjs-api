import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name);

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }
}
