import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { DEFAULT_PAGE_SIZE } from '../constants';

export class CursorQueryDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  cursor?: number;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  @IsIn([DEFAULT_PAGE_SIZE, 10, 25, 50, 100])
  limit?: number;
}
