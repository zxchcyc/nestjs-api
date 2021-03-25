import {
  Model,
  QueryFindOneAndUpdateOptions,
  ModelPopulateOptions,
  Aggregate,
  ModelUpdateOptions,
} from 'mongoose';
import {
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
  ObjectID,
  ClientSession,
} from 'mongodb';
import { IDatabaseOperation, Paginator } from '..';
import { BaseService } from './base.service';
import { getNamespace } from 'cls-hooked';

/**
 * 抽象基础的CRUD操作服务
 *
 * @export
 * @abstract
 * @class BaseMongoService
 * @template {T} T Model泛型
 */
export abstract class BaseMongoService<T> extends BaseService
  implements IDatabaseOperation<T> {
  /**
   * 构造函数
   * 忽略TS的类型检查, 因为是将Model注入到Service的,故在使用时会将Model 转换成 Mongoose 的 Document对象!
   */
  // @ts-ignore
  protected constructor(private readonly model: Model<T>, serviceName: string) {
    super(serviceName);
  }

  /**
   * 返回模型
   *    #Tips: 调用此函数时切勿使用 getMode().findOne(); 而是 getMode.findOne();
   */
  // @ts-ignore
  get getMode(): Model<T> {
    return this.model;
  }

  /**
   * 获取满足条件的全部数据
   *
   * @param {any} conditions
   * @param {(any)} [projection]
   * @param options
   *    sort?: any;
   *    limit?: number;
   *    skip?: number;
   *    populates?: ModelPopulateOptions[] | ModelPopulateOptions;
   *    [key: string]: any;
   * @returns {Promise<T[]>}
   */
  findAll(
    conditions?: any,
    projection?: any,
    options?: {
      sort?: any;
      limit?: number;
      skip?: number;
      populates?: ModelPopulateOptions[] | ModelPopulateOptions;
      [key: string]: any;
    },
    clientSession?: ClientSession,
  ): Promise<T[]> {
    // populates 提取出来
    const populates = (options && options.populates) || [];
    if (options && options.populates) {
      delete options.populates;
    }

    // 增加事务支持
    let docsQuery: any;
    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (session) {
      docsQuery = this.model
        .find(conditions, projection || {}, options)
        .session(session);
    } else {
      docsQuery = this.model.find(conditions, projection || {}, options);
    }

    return this.populates<T[]>(docsQuery, populates);
  }

  /**
   * 获取带分页的数据
   *
   * @param {any} conditions
   * @param {(any)} [projection]
   * @param options
   *    sort?: any;
   *    limit?: number;
   *    page?: number;
   *    populates?: ModelPopulateOptions[] | ModelPopulateOptions;
   *    [key: string]: any;
   * @returns {Promise<Paginator<T>>}
   */
  async paginator(
    conditions: any,
    projection?: any,
    options?: {
      sort?: any;
      limit?: number;
      page?: number;
      populates?: ModelPopulateOptions[] | ModelPopulateOptions;
      [key: string]: any;
    },
  ): Promise<Paginator<T>> {
    // 提取 limit page
    const limit = (options && options.limit) || 10;
    const page = (options && options.page) || 1;

    // 返回格式定义
    const result: Paginator<T> = {
      data: [],
      total: 0,
      limit: limit,
      skip: (page - 1) * limit,
      page: page,
      pages: 0,
    };

    if (options) {
      // page 用不到
      delete options.page;
    } else {
      options = {};
      options.limit = limit;
    }
    options.skip = (page - 1) * limit;

    result.total = await this.count(conditions);
    if (result.total > 0) {
      result.data = await this.findAll(conditions, projection || {}, options);
    }

    // 总页数
    result.pages = Math.ceil(result.total / result.limit) || 1;
    return Promise.resolve(result);
  }

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
    clientSession?: ClientSession,
  ): Promise<T | null> {
    // populates 提取出来
    const populates = (options && options.populates) || [];
    if (options && options.populates) {
      delete options.populates;
    }

    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    let docsQuery: any;
    if (session) {
      docsQuery = this.model
        .findOne(conditions, projection || {}, options)
        .session(session);
    } else {
      docsQuery = this.model.findOne(conditions, projection || {}, options);
    }
    return this.populates<T>(docsQuery, populates);
  }

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
    clientSession?: ClientSession,
  ): Promise<T | null> {
    // populates 提取出来
    const populates = (options && options.populates) || [];
    if (options && options.populates) {
      delete options.populates;
    }

    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    let docsQuery: any;
    if (session) {
      docsQuery = this.model
        .findById(id, projection || {}, options)
        .session(session);
    } else {
      docsQuery = this.model.findById(id, projection || {}, options);
    }
    return this.populates<T>(docsQuery, populates);
  }

  /**
   * 获取满足查询条件的数据数量
   *
   * @param {any} conditions
   * @returns {Promise<number>}
   */
  count(conditions: any, clientSession?: ClientSession): Promise<number> {
    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (session) {
      return this.model.countDocuments(conditions).session(session).exec();
    } else {
      return this.model.countDocuments(conditions).exec();
    }
  }

  /**
   * 创建数据 支持多条数据创建
   * 注意使用事务的时候不支持创建一条的写法 接收返回值的时候注意处理方式
   *
   * @param {T | T[]} docs
   * @returns {Promise<T>}
   */
  create(docs: T | any, clientSession?: ClientSession): Promise<T | any> {
    const user = getNamespace('create-nest-app').get('user');
    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (!Array.isArray(docs)) {
      docs = [docs];
    }

    docs = docs.map((element) => {
      element.createBy =
        element.createBy || (user && user.id && new ObjectID(user.id));
      element.gmtCreate = element.gmtCreate || new Date();
      element.gmModified = element.gmModified || new Date();
      return element;
    });

    if (session) {
      // WARNING: to pass a `session` to `Model.create()` in Mongoose, you **must** pass an array as the first argument.
      // See: https://mongoosejs.com/docs/api.html#model_Model.create
      return this.model.create(docs, { session: session });
    } else {
      if (docs.length === 1) {
        return this.model.create(docs[0]);
      } else {
        return this.model.create(docs);
      }
    }
  }

  /**
   * 多条数据创建
   *
   * @param {T | T[]} docs
   * @returns {Promise<T>}
   */
  insertMany(docs: T | any, clientSession?: ClientSession): Promise<T | any> {
    const user = getNamespace('create-nest-app').get('user');
    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (!Array.isArray(docs)) {
      docs = [docs];
    }

    docs = docs.map((element) => {
      element.createBy = user && user.id && new ObjectID(user.id);
      element.gmtCreate = new Date();
      element.gmModified = new Date();
      return element;
    });

    if (session) {
      // WARNING: to pass a `session` to `Model.create()` in Mongoose, you **must** pass an array as the first argument.
      // See: https://mongoosejs.com/docs/api.html#model_Model.create
      return this.model.insertMany(docs, { session: session });
    } else {
      return this.model.insertMany(docs);
    }
  }

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
    options: QueryFindOneAndUpdateOptions = {
      new: false,
      omitUndefined: true,
      runValidators: true,
    },
    clientSession?: ClientSession,
  ): Promise<T | null> {
    const user = getNamespace('create-nest-app').get('user');
    update = {
      ...update,
      gmModified: new Date(),
      modifiedBy: user && user.id && new ObjectID(user.id),
    };

    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (session) {
      return this.model
        .findByIdAndUpdate(id, update, options)
        .session(session)
        .exec();
    } else {
      return this.model.findByIdAndUpdate(id, update, options).exec();
    }
  }

  /**
   * 更新指定条件数据
   *
   * @param {string} id
   * @param update
   * @param options
   * @returns {Promise<T>}
   */
  findOneAndUpdate(
    query: any,
    update: Partial<T | any>,
    options: QueryFindOneAndUpdateOptions = {
      new: false,
      lean: true,
      omitUndefined: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
    clientSession?: ClientSession,
  ): Promise<T | null> {
    const user = getNamespace('create-nest-app').get('user');
    update = {
      ...update,
      gmModified: new Date(),
      modifiedBy: user && user.id && new ObjectID(user.id),
    };

    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (session) {
      return this.model
        .findOneAndUpdate(query, update, options)
        .session(session)
        .exec();
    } else {
      return this.model.findOneAndUpdate(query, update, options).exec();
    }
  }

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
    options: ModelUpdateOptions = {
      new: false,
      omitUndefined: true,
      runValidators: true,
    },
    clientSession?: ClientSession,
  ): Promise<T | null> {
    const user = getNamespace('create-nest-app').get('user');
    update = {
      ...update,
      gmModified: new Date(),
      modifiedBy: user && user.id && new ObjectID(user.id),
    };
    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (session) {
      return this.model
        .updateMany(conditions, update, options)
        .session(session)
        .exec();
    } else {
      return this.model.updateMany(conditions, update, options).exec();
    }
  }

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
    id: string | any,
    options?: {
      sort?: any;
      select?: any;
    },
    clientSession?: ClientSession,
  ): Promise<FindAndModifyWriteOpResultObject<T | null>> {
    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (session) {
      return this.model.findByIdAndRemove(id, options).session(session).exec();
    } else {
      return this.model.findByIdAndRemove(id, options).exec();
    }
  }

  /**
   * 删除多条符合条件的数据
   *
   * @param {any} [conditions={}]
   * @returns {Promise<void>}
   */
  deleteMany(
    conditions: any = {},
    clientSession?: ClientSession,
  ): Promise<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> {
    const session =
      clientSession || getNamespace('create-nest-app').get('session');
    if (session) {
      return this.model.deleteMany(conditions).session(session).exec();
    } else {
      return this.model.deleteMany(conditions).exec();
    }
  }

  /**
   * 聚合查询
   *
   * @param aggregations 查询条件
   */
  aggregate<R>(
    aggregations: any[],
    clientSession?: ClientSession,
  ): Promise<Aggregate<R[]>> {
    const session =
      clientSession || getNamespace('create-nest-app').get('session');

    if (session) {
      return this.model
        .aggregate(aggregations)
        .allowDiskUse(true)
        .session(session)
        .exec();
    } else {
      return this.model.aggregate(aggregations).allowDiskUse(true).exec();
    }
  }

  /**
   * 填充其他Model
   *
   * @protected
   * @param {any} docsQuery 源数据，用于填充后进行查询
   * @param {any} populates 需填充的model
   * @returns {(Promise<V | V[] | null>)}
   */
  protected populates<V>(docsQuery: any, populates: any): Promise<V | null> {
    if (populates) {
      [].concat(populates).forEach((item) => {
        docsQuery.populate(item);
      });
    }
    return docsQuery.exec();
  }

  /**
   * 获取带分页的数据 paginatorAggregate
   *
   * @param aggregations 查询条件
   * @param options
   *    limit?: number;
   *    page?: number;
   * @returns {Promise<Paginator<T>>}
   */
  async paginatorAggregate(
    aggregations: any[],
    options?: {
      limit?: number;
      page?: number;
      skip?: number;
    },
  ): Promise<Paginator<T>> {
    // 提取 limit page sort
    const sort = { gmtCreate: -1 };
    const limit = (options && options.limit) || 10;
    const page = (options && options.page) || 1;
    let skip = (page - 1) * limit;
    if (options && options.skip) {
      // 特殊场景使用 做额外的偏移量处理
      skip += options.skip;
    }

    // 返回格式定义
    const result: Paginator<T> = {
      data: [],
      total: 0,
      limit: limit,
      skip: (page - 1) * limit,
      page: page,
      pages: 0,
    };

    // 把排序条件过滤掉
    let aggregationsT = aggregations;
    aggregationsT = aggregationsT.filter((element) => {
      if (!Object.keys(element).includes('$sort')) {
        return element;
      }
    });

    // 聚合count查询优化
    let aggregationsCount = [...aggregationsT];
    let lastMatchIndex = 0;
    for (const index in aggregationsCount) {
      if (aggregationsCount[index].$match) {
        lastMatchIndex = Number(index);
      }
    }

    const countIndex = lastMatchIndex + 1;
    aggregationsCount.splice(countIndex, 0, { $count: 'total' });
    aggregationsCount = aggregationsCount.filter((element, index) => {
      if (Number(index) > countIndex && element.$project) {
        return false;
      }
      return true;
    });

    let list = await this.aggregate<T>(aggregationsCount);
    result.total = (list && list[0] && list[0]['total']) || 0;

    if (result.total > 0) {
      // 不存在$sort 或者 $sort 对象为空 增加默认排序
      const exist = aggregations.find((element) => {
        return Object.keys(element).includes('$sort');
      });
      if (!exist || !Object.keys(exist.$sort).length) {
        aggregationsT.unshift({
          $sort: sort,
        });
        aggregationsT.push({
          $skip: skip,
        });
        aggregationsT.push({
          $limit: limit,
        });
        result.data = await this.aggregate<T>(aggregationsT);
      } else {
        aggregations.push({
          $skip: skip,
        });
        aggregations.push({
          $limit: limit,
        });
        result.data = await this.aggregate<T>(aggregations);
      }
    }

    // 总页数
    result.pages = Math.ceil(result.total / result.limit) || 1;
    return Promise.resolve(result);
  }
}
