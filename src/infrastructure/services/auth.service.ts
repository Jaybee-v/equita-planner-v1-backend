import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async signin(
    credentials: UserEntity,
  ): Promise<{ token: string; refreshToken: string }> {
    const token = await this.generateToken(credentials, 'token');
    const refreshToken = await this.generateToken(credentials, 'refresh');
    return { token, refreshToken };
  }

  private async generateToken(
    user: UserEntity,
    type: 'token' | 'refresh',
  ): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn:
        type === 'token'
          ? process.env.JWT_TOKEN_EXPIRATION
          : process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async createTokens(
    user: UserEntity,
  ): Promise<{ token: string; refreshToken: string }> {
    const token = await this.generateToken(user, 'token');
    const refreshToken = await this.generateToken(user, 'refresh');
    return { token, refreshToken };
  }

  async validateGoogleUser(userDto: {
    email: string;
    role: UserRole;
    isVerified: boolean;
  }): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(userDto.email);
    if (!user) {
      const newUser = UserEntity.create({
        email: userDto.email,
        password: '',
        role: userDto.role,
        isIndependentInstructor: false,
        isVerified: true,
      });

      const createdUser = await this.userRepository.create(newUser);
      return createdUser;
    }
    return user;
  }
}
