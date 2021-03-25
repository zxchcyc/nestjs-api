import {
  THttpResponse,
  BaseController,
  IdDto,
  DeleteCmd,
  UpdateCmd,
  CreateCmd,
  PaginatorCmd,
  PermissionGuard,
  ParseObjectIdPipe,
  TransactionInterceptor,
  ApiPaginatedResponse,
  ResPaginatedDto,
} from '../../../../../../common';
import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { TitleService } from '../../../title.service';
import {
  PaginatorTitleDto,
  TitleDto,
  PaginatorAllTitleDto,
} from '../../../dto/title.dto';
import { TitleCmd } from '../../../cmd/title.cmd';
import { Title } from '../../../schemas/title.schema';
import { ObjectID } from 'mongodb';

@ApiBearerAuth()
@ApiTags('web/v1/title')
@Controller('web/v1/title')
@UseGuards(PermissionGuard)
export class TitleController extends BaseController {
  constructor(private readonly titleService: TitleService) {
    super();
  }

  @Post()
  async create(
    @Body(new ParseObjectIdPipe())
    data: TitleDto,
  ): Promise<THttpResponse<CreateCmd>> {
    const result = await this.titleService.create(data);
    return { result: new CreateCmd(result) };
  }

  @Delete(':id')
  // @UseInterceptors(TransactionInterceptor)
  async remove(@Param('id') id: IdDto): Promise<THttpResponse<DeleteCmd>> {
    await this.titleService.findById(id);

    // 岗位是否存在下级
    await this.titleService.isHasChild(id);

    // 检测是否已存在关联该岗位的用户 如果存在不能删除
    const isHasUser = false;
    if (isHasUser) {
      throw new BadRequestException('A0135');
    }

    const result = await this.titleService.deleteById(id);

    return { result: new DeleteCmd(result) };
  }

  @Put(':id')
  async update(
    @Param('id')
    id: IdDto,
    @Body(new ParseObjectIdPipe())
    data: TitleDto,
  ): Promise<THttpResponse<UpdateCmd>> {
    await this.titleService.findById(id);
    const result = await this.titleService.update(id, data);
    return { result: new UpdateCmd(result) };
  }

  @Get(':id')
  async findOne(
    @Param('id')
    id: IdDto,
  ): Promise<THttpResponse<TitleCmd>> {
    const result = await this.titleService.findById(id);
    return { result: new TitleCmd(result) };
  }

  @Post('list')
  @ApiPaginatedResponse(TitleDto)
  @ApiExtraModels(ResPaginatedDto, TitleDto)
  async findAll(
    @Body() data: PaginatorTitleDto,
  ): Promise<THttpResponse<PaginatorCmd<Title>>> {
    let { page, limit, startTime, endTime, sort, sortKey, name } = data;
    let filters = {};
    filters = this.utilService.common.listTimeFormat(
      startTime,
      endTime,
      filters,
    );
    if (name) {
      filters['name'] = {
        $regex: name,
        $options: '$i',
      };
    }
    let sorts = {};
    // sortKey 验证
    if (['gmtModified', 'gmtCreate'].includes(sortKey)) {
      sorts[sortKey] = sort;
    }
    const options = {
      page: page,
      limit: limit,
    };

    const aggregations = [
      {
        $match: filters,
      },
      {
        $lookup: {
          from: 'titles',
          localField: 'pid',
          foreignField: '_id',
          as: 'parent',
        },
      },
      {
        $sort: sorts,
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          gmtCreate: 1,
          gmtModified: 1,
          name: 1,
          describe: 1,
          parent: {
            $ifNull: [{ $arrayElemAt: ['$parent.name', 0] }, ''],
          },
        },
      },
    ];
    let result = await this.titleService.paginatorAggregate(
      aggregations,
      options,
    );
    return { result: new PaginatorCmd(result) };
  }

  @Post('all')
  async find(@Body() data: PaginatorAllTitleDto): Promise<THttpResponse<any>> {
    const { name } = data;
    let filters = {};
    if (name) {
      filters['name'] = {
        $regex: name,
        $options: '$i',
      };
    }
    let sorts = {};
    sorts['gmtCreate'] = -1;
    const aggregations = [
      {
        $match: filters,
      },
      {
        $sort: sorts,
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          gmtCreate: 1,
          gmtModified: 1,
          name: 1,
          describe: 1,
          pid: 1,
        },
      },
    ];
    let result = await this.titleService.aggregate(aggregations);
    return { result: result };
  }
}
