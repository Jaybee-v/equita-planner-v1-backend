import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStableDto {
  @IsString()
  @IsNotEmpty()
  userId: string = '';
  @IsString()
  @IsNotEmpty()
  name: string = '';
  @IsString()
  @IsNotEmpty()
  street: string = '';
  @IsNumber()
  @IsNotEmpty()
  numStreet: number = 0;
  @IsString()
  @IsNotEmpty()
  zip: string = '';
  @IsString()
  @IsNotEmpty()
  city: string = '';
  @IsString()
  @IsNotEmpty()
  country: string = '';
  @IsString()
  @IsNotEmpty()
  phone: string = '';
  @IsString()
  @IsOptional()
  website: string = '';
}
