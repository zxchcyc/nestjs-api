import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class ReqPaginatorDto {
  @IsNumber()
  readonly limit?: number = 10;

  @IsNumber()
  readonly page?: number = 1;

  @IsNumber()
  @IsIn([1, -1])
  @IsOptional()
  readonly sort?: number = -1;

  @IsString()
  @IsOptional()
  readonly sortKey?: string = 'gmtModified';

  @IsBoolean()
  @IsOptional()
  readonly cross?: boolean = false;
}
