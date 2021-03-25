// HTTP 异常返回接口
export interface IExceptionResponse {
  error: string;
  errorCode?: string;
  message?: any;
  status?: any;
  isNotEnumMsg?: boolean; // 不使用枚举错误消息时，传参true
}
