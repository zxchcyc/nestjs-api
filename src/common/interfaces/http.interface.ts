/**
 * @file HTTP 响应接口
 */

import { EHttpStatus, EHttpErrorCode } from '../enums';

// 分页数据返回格式
export interface IHttpResultPaginate<T> {
  data: T;
  params: any;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    page: number;
    pages: number;
  };
}

// HTTP 状态返回
export interface IBaseHttpResponse {
  status?: EHttpStatus;

  // 错误码
  errorCode?: string;

  // 这个字段可以不用 前端处理就好
  message?: EHttpErrorCode;

  traceId?: string;
}

// HTTP error
export type THttpErrorResponse = IBaseHttpResponse & {
  // 错误信息 调试有用
  error: any;
  stack?: any;
  debug?: string;
};

// HTTP success
export type THttpSuccessResponse<T> = IBaseHttpResponse & {
  // 成功返回的结果
  result?: T | IHttpResultPaginate<T>;
};

//  HTTP Response
export type THttpResponse<T> = THttpErrorResponse | THttpSuccessResponse<T>;
