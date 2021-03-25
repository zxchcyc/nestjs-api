import {
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
  ObjectID,
} from 'mongodb';
import {
  ModelPopulateOptions,
  ModelUpdateOptions,
  Aggregate,
  ClientSession,
} from 'mongoose';
import { BaseMongoService } from './base-mongo.service';
import { IDatabaseOperationBySoftDelete, Paginator } from '..';
import { getNamespace } from 'cls-hooked';

/**
 * 抽象带软删除数据的 CURD 操作服务
 * 指定 id 查找或者更新都不需要额外修改
 *
 * @export
 * @abstract
 * @class BaseMongoSoftDeleteService
 * @template {T} T Model泛型
 */
export abstract class BaseMongoSoftDeleteService<T>
  extends BaseMongoService<T>
  implements IDatabaseOperationBySoftDelete<T> {
  findAll(
    conditions?: any,
    projection?: any,
    options?: {
      lean?: boolean;
      sort?: any;
      limit?: number;
      skip?: number;
      populates?: ModelPopulateOptions[] | ModelPopulateOptions;
      [key: string]: any;
    },
    session?: ClientSession,
  ): Promise<T[]> {
    return super.findAll(
      {
        ...conditions,
        isDeleted: 0,
      },
      projection,
      options,
      session,
    );
  }

  count(conditions?: any): Promise<number> {
    return super.count({
      ...conditions,
      isDeleted: 0,
    });
  }

  paginator(
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
    return super.paginator(
      {
        ...conditions,
        isDeleted: 0,
      },
      projection,
      options,
    );
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
    if (aggregations && aggregations[0] && aggregations[0]['$match']) {
      aggregations[0]['$match']['isDeleted'] = 0;
    } else {
      aggregations.unshift({
        $match: { isDeleted: 0 },
      });
    }
    return super.paginatorAggregate(aggregations, options);
  }

  /**
   * 聚合查询
   *
   * @param aggregations 查询条件
   */
  aggregate<R>(aggregations: any[]): Promise<Aggregate<R[]>> {
    if (aggregations && aggregations[0] && aggregations[0]['$match']) {
      aggregations[0]['$match']['isDeleted'] = 0;
    } else {
      aggregations.unshift({
        $match: { isDeleted: 0 },
      });
    }
    return super.aggregate<R>(aggregations);
  }

  findOne(
    conditions: any,
    projection?: any,
    options?: {
      lean?: boolean;
      populates?: ModelPopulateOptions[] | ModelPopulateOptions;
      [key: string]: any;
    },
  ): Promise<T | null> {
    return super.findOne(
      {
        ...conditions,
        isDeleted: 0,
      },
      projection,
      options,
    );
  }

  updateMany(
    conditions: any,
    update: Partial<T | any>,
    options: ModelUpdateOptions = {
      new: true,
      omitUndefined: true,
      runValidators: true,
    },
    session?: ClientSession,
  ): Promise<T | null> {
    return super.updateMany(
      {
        ...conditions,
        isDeleted: 0,
      },
      update,
      options,
      session,
    );
  }

  async deleteById(
    id: string | any,
  ): Promise<FindAndModifyWriteOpResultObject<T | null>> {
    const user = getNamespace('create-nest-app').get('user');
    return super.update(id, {
      isDeleted: 1,
      gmtDeleted: new Date(),
      deletedBy: user && user.id && new ObjectID(user.id),
    });
  }

  async deleteMany(
    conditions: any = {},
  ): Promise<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> {
    const user = getNamespace('create-nest-app').get('user');
    return super.updateMany(
      {
        ...conditions,
        isDeleted: 0,
      },
      {
        isDeleted: 1,
        gmtDeleted: new Date(),
        deletedBy: user && user.id && new ObjectID(user.id),
      },
    );
  }

  /**
   * 恢复满足条件的已被删除的数据，若传入空对象({})则默认将所有已删除的数据都恢复
   *
   * @param conditions 条件
   */
  async restore(conditions: any = {}): Promise<T | null> {
    return super.updateMany(
      { ...conditions, isDeleted: 1 },
      { isDeleted: 0 },
    );
  }
}
