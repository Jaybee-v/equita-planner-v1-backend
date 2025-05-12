import { Injectable } from '@nestjs/common';
import { AffiliationRequestEntity } from 'src/domain/entities/affiliation-request.entity';
import { Status } from 'src/domain/enums/status.enum';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { PrismaService } from '../config/prisma.service';
import { AffiliationRequestMapper } from '../mappers/affiliation-request.mapper';

@Injectable()
export class AffiliationRequestRepository
  implements IAffiliationRequestRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    affiliation: AffiliationRequestEntity,
  ): Promise<AffiliationRequestEntity> {
    const raw = await this.prisma.affiliationRequest.create({
      data: {
        riderId: affiliation.riderId,
        stableId: affiliation.stableId,
        status: affiliation.status,
      },
    });

    return AffiliationRequestMapper.toDomain(raw);
  }

  async findByRiderId(riderId: string): Promise<AffiliationRequestEntity[]> {
    const raw = await this.prisma.affiliationRequest.findMany({
      where: { riderId },
    });

    return raw.map((affiliation) =>
      AffiliationRequestMapper.toDomain(affiliation),
    );
  }

  async findByStableId(params: {
    stableId: string;
    status?: Status;
    page: number;
    limit: number;
  }): Promise<AffiliationRequestEntity[]> {
    const { stableId, status, page, limit } = params;
    const raw = await this.prisma.affiliationRequest.findMany({
      where: { stableId, status },
      include: {
        rider: {
          include: {
            user: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return raw.map((affiliation) =>
      AffiliationRequestMapper.toDomain(affiliation),
    );
  }

  async findByDifferentsUser(data: {
    stableId: string;
    riderId: string;
  }): Promise<AffiliationRequestEntity | null> {
    const raw = await this.prisma.affiliationRequest.findFirst({
      where: { stableId: data.stableId, riderId: data.riderId },
    });

    return raw ? AffiliationRequestMapper.toDomain(raw) : null;
  }

  async findById(id: string): Promise<AffiliationRequestEntity | null> {
    const raw = await this.prisma.affiliationRequest.findFirst({
      where: { id },
      include: {
        rider: true,
        stable: true,
      },
    });

    return raw ? AffiliationRequestMapper.toDomain(raw) : null;
  }

  async updateStatus(
    id: string,
    status: Status,
  ): Promise<AffiliationRequestEntity> {
    const raw = await this.prisma.affiliationRequest.update({
      where: { id },
      data: { status },
    });
    return AffiliationRequestMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.affiliationRequest.delete({ where: { id } });
  }

  async countApprovedAffiliationRequest(stableId: string): Promise<number> {
    const raw = await this.prisma.affiliationRequest.count({
      where: { stableId, status: Status.APPROVED },
    });
    return raw;
  }
}
