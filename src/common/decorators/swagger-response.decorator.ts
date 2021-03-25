import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
// import { ResPaginatedDto } from '../dto/res-paginator.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResPaginatedDto<TData> {
  @ApiProperty({
    description: '总数',
  })
  total: number;

  @ApiProperty({
    description: '一页数量',
  })
  limit: number;

  @ApiProperty({
    description: '起始行',
  })
  skip: number;

  @ApiProperty({
    description: '当前页',
  })
  page: number;

  @ApiProperty({
    description: '总页数',
  })
  pages: number;

  data: TData[];
}

export const ApiCommResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        properties: {
          errorCode: {
            type: 'string',
            description: '错误码',
            example: '00000',
          },
          message: {
            type: 'string',
            description: '错误消息',
            example: '一切 ok',
          },
          result: {
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
  );
};

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        properties: {
          errorCode: {
            type: 'string',
            description: '错误码',
            example: '00000',
          },
          message: {
            type: 'string',
            description: '错误消息',
            example: '一切 ok',
          },
          result: {
            allOf: [
              { $ref: getSchemaPath(ResPaginatedDto) },
              {
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
  );
};
