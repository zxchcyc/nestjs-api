/*
 * @Author: archer zheng
 * @Date: 2020-12-14 16:28:03
 * @LastEditTime: 2021-03-24 16:49:48
 * @LastEditors: Please set LastEditors
 * @Description: 生产环境标识装饰器
 * @FilePath: /edc-api/src/common/decorators/taskProcess.decorator.ts
 */

export function prodProcess(): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      if (process.env.NODE_ENV !== 'prod') {
        return;
      }
      await originalMethod.apply(this, [...args]);
    };
    return descriptor;
  };
}
