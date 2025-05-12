import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export interface IUserRepository {
  create(userDto: UserEntity): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  updateUserPassword(password: string, userId: string): Promise<UserEntity>;
  updateUserMustChangePassword(
    mustChangePassword: boolean,
    userId: string,
  ): Promise<UserEntity>;
  updateUserRole(role: UserRole, userId: string): Promise<UserEntity>;
  deleteUser(userId: string): Promise<void>;
}
