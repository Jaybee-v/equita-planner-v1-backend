import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AffiliationRequestEntity } from 'src/domain/entities/affiliation-request.entity';
import { Status } from 'src/domain/enums/status.enum';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { FindAffiliationByStableIdQuery } from './find-by-stable-id.query';

@Injectable()
export class FindAffiliationByStableIdHandler {
  constructor(
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(query: FindAffiliationByStableIdQuery): Promise<{
    waiting: Record<string, AffiliationRequestEntity>[];
    approved: Record<string, AffiliationRequestEntity>[];
    total: number;
  }> {
    const user = await this.stableRepository.findByUserId(query.requestedBy);

    if (!user) {
      throw new Error('Aucun utilisateur trouvé');
    }

    if (user.id !== query.stableId) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits pour accéder à cette page",
      );
    }

    const acceptedAffiliationRequest =
      await this.affiliationRequestRepository.findByStableId({
        stableId: query.stableId,
        status: Status.APPROVED,
        page: query.page,
        limit: query.limit,
      });
    const pendingAffiliationRequest =
      await this.affiliationRequestRepository.findByStableId({
        stableId: query.stableId,
        status: Status.PENDING,
        page: 1,
        limit: 20,
      });

    const total =
      await this.affiliationRequestRepository.countApprovedAffiliationRequest(
        query.stableId,
      );

    return {
      waiting: pendingAffiliationRequest.map((a) => a.toJson()),
      approved: acceptedAffiliationRequest.map((a) => a.toJson()),
      total,
    };
  }
}
