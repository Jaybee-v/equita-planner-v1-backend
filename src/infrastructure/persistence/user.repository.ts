import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserAlreadyExists } from 'src/application/exceptions/user.exceptions';
import { UserEntity } from 'src/domain/entities/user.entity';
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
}
