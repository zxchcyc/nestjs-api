/*
 * @Author: archer zheng
 * @Date: 2020-07-21 18:59:58
 * @LastEditTime: 2021-03-25 09:45:40
 * @LastEditors: Please set LastEditors
 * @Description: 前端进来的 id 转成 ObjectID
 * @FilePath: /edc-api/src/common/pipes/parse-objectid.pipe.ts
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectID } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectID> {
  transform(value: any, metadata: ArgumentMetadata): ObjectID {
    if (value.titles && value.titles.length) {
      value.titles = value.titles.map((element) => {
        return new ObjectID(element);
      });
    }

    return value;
  }
}
