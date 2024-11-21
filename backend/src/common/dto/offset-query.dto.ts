import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class GenericQueryDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  offset?: number;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit?: number;
}
