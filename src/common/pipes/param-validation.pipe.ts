import {
  PipeTransform,
  ArgumentMetadata,
  Injectable,
  ValidationPipeOptions,
  Optional,
  BadRequestException,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { validate, ValidatorOptions } from 'class-validator';
import {
  classToPlain,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';

/**
 * 请求参数检验 Pipe
 *
 * 参考资料：
 * @see https://github.com/typestack/class-validator#validation-groups
 */
@Injectable()
export class ParameterValidationPipe implements PipeTransform {
  protected isTransformEnabled: boolean;
  protected isDetailedOutputDisabled: boolean;
  protected validatorOptions: ValidatorOptions;

  constructor(@Optional() options?: ValidationPipeOptions) {
    // tslint:disable-next-line:no-parameter-reassignment
    options = options || {};
    const { transform, disableErrorMessages, ...validatorOptions } = options;
    this.isTransformEnabled = !!transform;
    this.validatorOptions = validatorOptions;
    this.isDetailedOutputDisabled = disableErrorMessages;
  }

  async transform(entity: any, metadata: ArgumentMetadata) {
    const { metatype, type } = metadata;
    if (!metatype || !this.toValidate(metadata)) return entity;
    const transformOptions: ClassTransformOptions = {
      excludePrefixes: ['__'],
    };

    // 获取当前的校验组信息
    if (entity.__validateGroups) {
      this.validatorOptions.groups = entity.__validateGroups;
      transformOptions.groups = entity.__validateGroups;
    }

    // 映射原始数据为指定类型的数据
    const entityClass = plainToClass(
      metatype,
      ParameterValidationPipe.toEmptyIfNil(entity),
      transformOptions,
    );

    // 校验对象
    const errors = await validate(entityClass, this.validatorOptions);
    if (errors.length > 0) {

      // 抛出异常
      throw new BadRequestException(errors, 'A0101');
    }
    return this.isTransformEnabled
      ? entityClass
      : Object.keys(this.validatorOptions).length > 0
      ? classToPlain(metadata)
      : entity;
  }

  private toValidate({ metatype, type }: ArgumentMetadata): boolean {
    if (type === 'custom') return false;
    const types = [String, Boolean, Number, Array, Object];
    return (
      !types.some((itemType) => {
        metatype === itemType;
      }) && !isNil(metatype)
    );
  }

  private static toEmptyIfNil<T, R>(value: T): R | {} {
    return isNil(value) ? {} : value;
  }
}
