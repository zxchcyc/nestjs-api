import {
  IsArray,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsIn,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReqPaginatorDto } from 'src/common';

export class TitleDto {
  @ApiProperty({
    description: '岗位名称',
    example: '后端工程师',
  })
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: '岗位描述',
    example: 'nodejs 技术栈',
  })
  @MaxLength(200)
  @IsString()
  @IsOptional()
  readonly describe: string = '';

  @ApiProperty({
    description: '上级岗位ID',
    example: 'objectId',
  })
  @IsString()
  @IsOptional()
  readonly pid: string;
}

export class PaginatorTitleDto extends ReqPaginatorDto {
  @IsString()
  @IsOptional()
  readonly name?: string = '';

  @IsString()
  @IsOptional()
  readonly startTime?: string = '';

  @IsString()
  @IsOptional()
  readonly endTime?: string = '';
}

export class PaginatorAllTitleDto {
  @IsString()
  @IsOptional()
  readonly name?: string = '';

  @IsBoolean()
  @IsOptional()
  readonly cross?: boolean = false;

  @IsBoolean()
  @IsOptional()
  readonly tree?: boolean = false;
}
