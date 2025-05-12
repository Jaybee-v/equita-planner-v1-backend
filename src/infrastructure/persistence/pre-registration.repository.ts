import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PreRegistrationAlreadyExists } from 'src/application/exceptions/pre-registration.exceptions';
import { PreRegistrationEntity } from 'src/domain/entities/pre-registration.entity';
import { IPreRegistrationRepository } from 'src/domain/interfaces/pre-registration.repository';
import { PrismaService } from '../config/prisma.service';
import { PreRegistrationMapper } from '../mappers/pre-registration.mapper';

@Injectable()
export class PreRegistrationRepository implements IPreRegistrationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    preRegistration: PreRegistrationEntity,
  ): Promise<PreRegistrationEntity> {
    try {
      const _preRegistration = await this.prisma.preRegistration.create({
        data: {
          email: preRegistration.email,
        },
      });

      return PreRegistrationMapper.toDomain(_preRegistration);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new PreRegistrationAlreadyExists(preRegistration.email);
        }
      }
      throw new Error('Failed to create pre-registration');
    }
  }

  async findByEmail(email: string): Promise<PreRegistrationEntity | null> {
    const preRegistration = await this.prisma.preRegistration.findUnique({
      where: { email },
    });

    return preRegistration
      ? PreRegistrationMapper.toDomain(preRegistration)
      : null;
  }
}
