import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './../../pagination/dto/pagination.dto';
export enum EnumProductSort {
  HIGH_PRICE = 'high_price',
  LOW_PRICE = 'low_price',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class GetAllProductDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumProductSort)
  sort?: EnumProductSort;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
