import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePriceDto {
  @IsString()
  @IsNotEmpty()
  label: string = '';

  @IsString()
  @IsOptional()
  description: string = '';

  @IsNumber()
  @IsNotEmpty()
  price: number = 1;

  @IsString()
  @IsNotEmpty()
  stableId: string = '';
}
