import { AffiliationRequestEntity } from '../entities/affiliation-request.entity';
import { Status } from '../enums/status.enum';

export interface IAffiliationRequestRepository {
  create(
    affiliation: AffiliationRequestEntity,
  ): Promise<AffiliationRequestEntity>;
  findByRiderId(riderId: string): Promise<AffiliationRequestEntity[]>;
  findByStableId(params: {
    stableId: string;
    status?: Status;
    page?: number;
    limit?: number;
  }): Promise<AffiliationRequestEntity[]>;
  findByDifferentsUser(data: {
    stableId: string;
    riderId: string;
  }): Promise<AffiliationRequestEntity | null>;
  findById(id: string): Promise<AffiliationRequestEntity | null>;
  updateStatus(id: string, status: Status): Promise<AffiliationRequestEntity>;
  delete(id: string): Promise<void>;

  countApprovedAffiliationRequest(stableId: string): Promise<number>;
}
