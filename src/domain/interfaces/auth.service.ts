import { UserEntity } from '../entities/user.entity';

export interface IAuthService {
  signin(credentials: UserEntity): Promise<string>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
