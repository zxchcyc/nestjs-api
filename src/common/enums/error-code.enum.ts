/*
 * @Author: archer zheng
 * @Date: 2020-08-04 18:14:46
 * @LastEditTime: 2021-03-25 09:57:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /edc-api/src/common/enums/error-code.enum.ts
 */
// 内部错误码
export enum EHttpErrorCode {

  // 业务错误
  '00000' = '一切 ok',
  'A0001' = '用户端错误',
  'A0002' = '请求次数超过限制',
  'A0003' = '请联系管理员添加白名单',
  'A0004' = '获取不到客户端 IP',
  'A0106' = '未经授权',
  
  // 错误码区间
  // system：A0100 - A0199
  'A0100' = '演示用',
  'A0133' = '岗位名称已经存在',
  'A0134' = '该岗位已经存在下级，不能删除',
  'A0135' = '该岗位已经关联用户，不能删除',
  'A0136' = '该岗位不存在',

  // 系统错误
  'B0001' = '系统执行出错',
  'B0100' = '系统执行超时',
  'B0101' = '数据库报错',
  'B0102' = '系统没有这个接口',
  'B0103' = '请求超时',

  // 第三方错误
  'C0001' = '调用第三方服务出错',
}
