import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActivityType } from 'src/domain/enums/activity-type.enum';
import { ActivityVisibility } from 'src/domain/enums/activity-visibility.enum';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';
import { ValidationOption } from 'src/domain/enums/validation-option.enum';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  stableId: string = '';

  @IsString()
  @IsNotEmpty()
  title: string = '';

  @IsString()
  @IsOptional()
  description: string = '';

  @IsString()
  @IsNotEmpty()
  date: Date = new Date();

  @IsString()
  @IsNotEmpty()
  startDate: Date = new Date();

  @IsString()
  @IsNotEmpty()
  endDate: Date = new Date();

  @IsEnum(ActivityType)
  @IsNotEmpty()
  type: ActivityType = ActivityType.PUBLIC;

  @IsEnum(ActivityVisibility)
  @IsNotEmpty()
  visibility: ActivityVisibility = ActivityVisibility.PUBLIC;

  @IsEnum(RiderLevel)
  @IsNotEmpty()
  requiredLevel: RiderLevel = RiderLevel.ALL;

  @IsNumber()
  @IsNotEmpty()
  maxParticipants: number = 1;

  @IsEnum(ValidationOption)
  @IsNotEmpty()
  validationParticipantOption: ValidationOption = ValidationOption.AUTOMATIC;

  @IsBoolean()
  @IsNotEmpty()
  openToMoreLevel: boolean = false;

  @IsOptional()
  instructorId: string = '';

  @IsString()
  @IsNotEmpty()
  priceId: string = '';
}
