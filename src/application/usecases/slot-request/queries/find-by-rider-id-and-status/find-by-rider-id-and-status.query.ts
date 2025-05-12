import { Status } from 'src/domain/enums/status.enum';

export class FindByRiderIdAndStatusQuery {
  constructor(
    public readonly riderId: string,
    public readonly status: Status,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
