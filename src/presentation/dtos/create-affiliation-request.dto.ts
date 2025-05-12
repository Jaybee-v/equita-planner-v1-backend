import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAffiliationRequestDto {
  @IsString()
  @IsNotEmpty()
  stableId: string = '';

  @IsString()
  @IsNotEmpty()
  riderId: string = '';
}
