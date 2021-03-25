/**
 * @file HTTP 响应枚举
 */

// HTTP 响应状态码
export enum EHttpResponseCode {
  Error = 400,
  Success = 200,
  Forbidden = 403,
}

// 响应状态枚举 基础标识 
export enum EHttpStatus {
  Error = 'error',
  Success = 'success',
  Forbidden = 'forbidden',
}
