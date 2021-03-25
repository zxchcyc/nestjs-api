import { createParamDecorator } from '@nestjs/common';

/**
 * 获取请求参数，注入验证组到请求参数实体中
 * 暂时不用
 * @param groups 传入分组信息
 */
export const validateGroups = createParamDecorator((groups: string[], req) => {
  // 将所有请求参数中添加校验分组对象数据
  req.body.__validateGroups = req.params.__validateGroups = req.query.__validateGroups = groups;

  // 在 body 中注入当前的语言标志
  req.body.__lang = req.query.lang;
  return req;
});
