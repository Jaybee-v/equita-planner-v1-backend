import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserAlreadyExists } from 'src/application/exceptions/user.exceptions';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { PrismaService } from '../config/prisma.service';
import { UserMapper } from '../mappers/user.mapper';
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: UserEntity): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: userDto.email,
          password: userDto.password,
          role: userDto.role,
          invitedBy: userDto.invitedBy,
          mustChangePassword: userDto.mustChangePassword,
          isVerified: userDto.isVerified,
        },
      });
      return UserMapper.toDomain(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UserAlreadyExists(userDto.email);
        }
      }
      throw new Error('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: {
        notifications: {
          orderBy: {
            createdAt: 'desc',
          },

          take: 5,
        },
        userSetting: true,
      },
    });
    return user
      ? UserMapper.toDomain({
          ...user,
          userSetting: user.userSetting || undefined,
        })
      : null;
  }

  async updateUserPassword(
    password: string,
    userId: string,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
    return UserMapper.toDomain(user);
  }

  async updateUserMustChangePassword(
    mustChangePassword: boolean,
    userId: string,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { mustChangePassword },
    });
    return UserMapper.toDomain(user);
  }

  async updateUserRole(role: UserRole, userId: string): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return UserMapper.toDomain(user);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
