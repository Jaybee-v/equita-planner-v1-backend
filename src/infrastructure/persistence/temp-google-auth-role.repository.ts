import { Injectable } from '@nestjs/common';
import { TempGoogleAuthRoleEntity } from 'src/domain/entities/temp-google-auth-role.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { ITempGoogleAuthRoleRepository } from 'src/domain/interfaces/temp-google-auth-role.repository';
import { PrismaService } from '../config/prisma.service';
import { TempGoogleAuthRoleMapper } from '../mappers/temp-google-auth-role.mapper';

@Injectable()
export class TempGoogleAuthRoleRepository
  implements ITempGoogleAuthRoleRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(role: UserRole): Promise<TempGoogleAuthRoleEntity> {
    const tempGoogleAuthRole = await this.prisma.tempGoogleAuthRole.create({
      data: {
        role: role,
      },
    });

    return TempGoogleAuthRoleMapper.toDomain(tempGoogleAuthRole);
  }

  async findLast(): Promise<TempGoogleAuthRoleEntity | null> {
    const tempGoogleAuthRole = await this.prisma.tempGoogleAuthRole.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return tempGoogleAuthRole
      ? TempGoogleAuthRoleMapper.toDomain(tempGoogleAuthRole)
      : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.tempGoogleAuthRole.delete({ where: { id } });
  }
}
