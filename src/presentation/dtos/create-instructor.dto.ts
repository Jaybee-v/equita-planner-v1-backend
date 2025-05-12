import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'src/domain/enums/gender.enum';

export class CreateInstructorDto {
  @IsOptional()
  userId: string = '';

  @IsBoolean()
  @IsNotEmpty()
  isIndependent: boolean = false;

  @IsString()
  @IsNotEmpty()
  name: string = '';

  @IsString()
  @IsNotEmpty()
  familyName: string = '';

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender = Gender.N;

  @IsString()
  @IsNotEmpty()
  phone: string = '';

  @IsOptional()
  @IsString()
  email: string = '';

  @IsOptional()
  stableId: string = '';

  @IsOptional()
  @IsString()
  color: string = '';
}
