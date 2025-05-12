import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';

export interface IAuthService {
  signin(
    credentials: UserEntity,
  ): Promise<{ token: string; refreshToken: string }>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  createTokens(
    user: UserEntity,
  ): Promise<{ token: string; refreshToken: string }>;
  validateGoogleUser(userDto: {
    email: string;
    role: UserRole;
    isVerified: boolean;
  }): Promise<UserEntity>;
}
