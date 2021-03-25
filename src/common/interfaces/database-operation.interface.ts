import {
  Aggregate,
  ModelPopulateOptions,
  ModelUpdateOptions,
  QueryFindOneAndUpdateOptions,
} from 'mongoose';
import {
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
} from 'mongodb';
import { Paginator } from './paginator.interface';

/**
 * 数据库操作相关函数接口
 *
 * @interface IDatabaseOperation
 * @template {T} T Model泛型
 */
export interface IDatabaseOperation<T> {
  /**
   * 获取满足条件的全部数据
   *
   * @param {any} conditions
   * @param {(any | null)} [projection]
   * @param options
   *    sort?: any;
   *    limit?: number;
   *    skip?: number;
   *    populates?: ModelPopulateOptions[] | ModelPopulateOptions;
   *    [key: string]: any;
   * @returns {Promise<T[]>}
   */
  findAll(
    conditions: any,
    projection?: any | null,
    options?: {
      sort?: any;
      limit?: number;
      skip?: number;
      populates?: ModelPopulateOptions[] | ModelPopulateOptions;
      [key: string]: any;
    },
  ): Promise<T[]>;

  /**
   * 获取带分页的数据
   *
   * @param {any} conditions
   * @param {(any | null)} [projection]
   * @param options
   *    sort?: any;
   *    limit?: number;
   *    page?: number;
   *    populates?: ModelPopulateOptions[] | ModelPopulateOptions;
   *    [key: string]: any;
   * @returns {Promise<Paginator<T>>}
   */
  paginator(
    conditions: any,
    projection?: any | null,
    options?: {
      sort?: any;
      limit?: number;
      page?: number;
      populates?: ModelPopulateOptions[] | ModelPopulateOptions;
      [key: string]: any;
    },
  ): Promise<Paginator<T>>;

  /**
   * 获取单条数据
   *
   * @param {any} conditions
   * @param {any} [projection]
   * @param options
   *    lean?: boolean;
   *    populates?: ModelPopulateOptions[] | ModelPopulateOptions;
   *    [key: string]: any;
   * @returns {(Promise<T | null>)}
   */
  findOne(
    conditions: any,
    projection?: any,
    options?: {
      lean?: boolean;
      populates?: ModelPopulateOptions[] | ModelPopulateOptions;
      [key: string]: any;
    },
  ): Promise<T | null>;

  /**
   * 根据id获取单条数据
   *
   * @param {(any | string | number)} id
   * @param {any} [projection]
   * @param options
   *    lean?: boolean;
   *    populates?: ModelPopulateOptions[] | ModelPopulateOptions;
   *    [key: string]: any;
   * @returns {(Promise<T | null>)}
   */
  findById(
    id: any | string | number,
    projection?: any,
    options?: {
      lean?: boolean;
      populates?: ModelPopulateOptions[] | ModelPopulateOptions;
      [key: string]: any;
    },
  ): Promise<T | null>;

  /**
   * 获取满足查询条件的数据数量
   *
   * @param {any} conditions
   * @returns {Promise<number>}
   */
  count(conditions: any): Promise<number>;

  /**
   * 创建一条数据
   *
   * @param {T} docs
   * @returns {Promise<T>}
   */
  create(docs: T | any): Promise<T>;

  /**
   * 更新指定id数据
   *
   * @param {string} id
   * @param update
   * @param options
   * @returns {Promise<T>}
   */
  update(
    id: any | number | string,
    update: Partial<T | any>,
    options: QueryFindOneAndUpdateOptions,
  ): Promise<T | null>;

  /**
   * 更新指定数据
   *
   * @param query
   * @param update
   * @param options
   * @returns {Promise<T>}
   */
  findOneAndUpdate(
    query: any,
    update: Partial<T | any>,
    options?: QueryFindOneAndUpdateOptions,
  ): Promise<T | null>;

  /**
   * 更新符合条件的数据
   *
   * @param {any} conditions
   * @param update
   * @param options
   * @returns {Promise<T>}
   */
  updateMany(
    conditions: any,
    update: Partial<T | any>,
    options: ModelUpdateOptions,
  ): Promise<T | null>;

  /**
   * 删除指定id数据
   *
   * @param {string} id
   * @param options
   *    如果条件匹配多个数据, 设置排序顺序以选择要更新的文档
   *    sort?: any;
   *    设置要返回的数据的字段
   *    select?: any;
   * @returns {Promise<T>}
   */
  deleteById(
    id: string,
    options?: {
      sort?: any;
      select?: any;
    },
  ): Promise<FindAndModifyWriteOpResultObject<T | null>>;

  /**
   * 删除多条符合条件的数据
   *
   * @param {any} [conditions={}]
   * @returns {Promise<void>}
   */
  deleteMany(
    conditions: any,
  ): Promise<DeleteWriteOpResultObject['result'] & { deletedCount?: number }>;

  /**
   * 聚合查询
   *
   * @param aggregations 查询条件
   */
  aggregate<R>(aggregations: any[]): Promise<Aggregate<R[]>>;
}

/**
 * 声明软删除数据库操作相关函数接口
 *
 * @export
 * @interface IDatabaseOperationBySoftDelete
 * @template {T} T Model泛型
 */
export interface IDatabaseOperationBySoftDelete<T>
  extends IDatabaseOperation<T> {
  /**
   * 恢复满足条件的已被删除的数据，若传入空对象({})则默认将所有已删除的数据都恢复
   *
   * @param conditions 条件
   */
  restore(conditions: any): Promise<T | null>;
}
