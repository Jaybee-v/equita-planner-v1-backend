import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { PrismaService } from '../config/prisma.service';
import { RiderMapper } from '../mappers/rider.mapper';

@Injectable()
export class RiderRepository implements IRiderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(riderDto: RiderEntity): Promise<RiderEntity> {
    try {
      const createdRider = await this.prisma.rider.create({
        data: {
          userId: riderDto.userId,
          name: riderDto.name,
          familyName: riderDto.familyName,
          level: riderDto.level,
          imageUrl: riderDto.imageUrl,
        },
      });

      return RiderMapper.toDomain(createdRider);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Vous êtes déjà enregistré en tant que cavalier',
          );
        }
      }
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<RiderEntity | null> {
    const rider = await this.prisma.rider.findUnique({
      where: { userId },
      include: {
        affiliationRequests: {
          include: {
            stable: true,
          },
        },
      },
    });

    if (!rider) {
      return null;
    }

    console.log('Rider PRISMA ===', rider);

    return RiderMapper.toDomain(rider);
  }

  async findById(id: string): Promise<RiderEntity | null> {
    const rider = await this.prisma.rider.findUnique({
      where: { id },
      include: {
        user: true,
        affiliationRequests: true,
      },
    });
    return rider ? RiderMapper.toDomain(rider) : null;
  }
}
