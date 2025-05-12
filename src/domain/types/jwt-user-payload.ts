import { UserRole } from '../enums/user-role.enum';

export type JwtUserPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
