import { Inject } from '@nestjs/common';
import { UtilService } from '../../internal/util/util.service';

/**
 * Controller 基础类
 */
export abstract class BaseController {
  
  @Inject()
  protected readonly utilService: UtilService;
}
