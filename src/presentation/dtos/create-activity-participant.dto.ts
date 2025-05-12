import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityParticipantDto {
  @IsString()
  @IsNotEmpty()
  activityId: string = '';

  @IsString()
  @IsNotEmpty()
  riderId: string = '';
}
