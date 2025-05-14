import { IsEnum, IsNotEmpty } from 'class-validator';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';

export class UpdateRiderLevelDto {
  @IsEnum(RiderLevel)
  @IsNotEmpty()
  level: RiderLevel = RiderLevel.GALOP_1;
}
