/**
 * api 业务异常控制器 和 服务层返回类型
 *
 * @export ErrorCode
 * @interface ErrorCode
 */
export interface ErrorCode {
  errorCode?: string;
  [propName: string]: any;
}
