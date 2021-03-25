/**
 * 分页器返回结果接口
 *
 * @export Paginator
 * @interface Paginator
 * @template T Model
 */
export interface Paginator<T> {
  data: T[];
  total: number;
  limit: number;
  skip?: number;
  page?: number;
  pages?: number;
}
