import { PreRegistrationEntity } from '../entities/pre-registration.entity';

export interface IPreRegistrationRepository {
  create(
    preRegistration: PreRegistrationEntity,
  ): Promise<PreRegistrationEntity>;
  findByEmail(email: string): Promise<PreRegistrationEntity | null>;
}
