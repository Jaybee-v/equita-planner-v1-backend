import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from 'src/domain/enums/status.enum';

export class UpdateAffiliationRequestStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status = Status.APPROVED;
}
