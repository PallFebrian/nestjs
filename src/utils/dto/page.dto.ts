import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageRequestDto {
  @IsInt()
  @Type(() => Number)
  page = 1;

  @IsInt()
  @Type(() => Number)
  pageSize = 10;

  @IsInt()
  @Type(() => Number)
  limit: number;
}
