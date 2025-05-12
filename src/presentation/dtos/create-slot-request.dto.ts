import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSlotRequestDto {
  @IsString()
  @IsNotEmpty()
  stableId: string = '';

  @IsString()
  @IsNotEmpty()
  riderId: string = '';

  @IsString()
  @IsOptional()
  message: string = '';

  @IsString()
  @IsNotEmpty()
  preferredStartDate: string = '';

  @IsString()
  @IsNotEmpty()
  preferredEndDate: string = '';
}
