import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/domain/enums/gender.enum';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';

export class CreateRiderDto {
  @IsString()
  @IsNotEmpty()
  userId: string = '';

  @IsString()
  @IsNotEmpty()
  name: string = '';

  @IsString()
  @IsNotEmpty()
  familyName: string = '';

  @IsEnum(RiderLevel)
  @IsNotEmpty()
  level: RiderLevel = RiderLevel.BEGINNER;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender = Gender.N;
}
