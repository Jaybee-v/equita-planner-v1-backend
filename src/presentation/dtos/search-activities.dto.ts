import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';

export class SearchActivitiesDto {
  @IsString()
  @IsNotEmpty()
  stableId: string = '';

  @IsString()
  @IsOptional()
  date: string = '';

  @IsString()
  @IsOptional()
  search: string = '';

  @IsString()
  @IsOptional()
  requiredLevel: RiderLevel = RiderLevel.ALL;
}
