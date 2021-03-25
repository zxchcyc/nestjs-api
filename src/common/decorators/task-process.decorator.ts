/*
 * @Author: archer zheng
 * @Date: 2020-12-14 16:28:03
 * @LastEditTime: 2021-03-25 13:54:49
 * @LastEditors: Please set LastEditors
 * @Description: 定时任务装饰器 根据环境变量决定是否启动定时任务 TASK_ENABLED
 * @FilePath: /edc-api/src/common/decorators/taskProcess.decorator.ts
 */

export function taskProcess(): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // console.log('是否开启定时任务', process.env.TASK_ENABLED  );
      if (!['1', 'true', 'TRUE'].includes(process.env.TASK_ENABLED)) {
        return;
      }
      await originalMethod.apply(this, [...args]);
    };
    return descriptor;
  };
}
