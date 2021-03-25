import { UtilService } from '../../internal/util/util.service';
import { EnvService } from '../../internal/env/env.service';
import { Logger, Inject } from '@nestjs/common';

/**
 * 抽象基础服务
 *
 */
export abstract class BaseService {
  @Inject()
  protected readonly utilService: UtilService;
  @Inject()
  protected readonly envService: EnvService;
  protected logger: Logger;

  protected constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }
}
