import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/domain/enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string = '';

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  password: string = '';

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole = UserRole.STABLE;

  @IsOptional()
  @IsBoolean()
  isIndependentInstructor: boolean = false;
}
