import { TempGoogleAuthRoleEntity } from '../entities/temp-google-auth-role.entity';
import { UserRole } from '../enums/user-role.enum';

export interface ITempGoogleAuthRoleRepository {
  create(role: UserRole): Promise<TempGoogleAuthRoleEntity>;
  findLast(): Promise<TempGoogleAuthRoleEntity | null>;
  delete(id: number): Promise<void>;
}
