import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePreRegistrationDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string = '';
}
