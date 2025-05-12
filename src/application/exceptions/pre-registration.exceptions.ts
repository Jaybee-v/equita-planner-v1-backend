import { BaseExceptions } from './base-exceptions';

export class PreRegistrationAlreadyExists extends BaseExceptions {
  constructor(email: string) {
    super(400, `L'adresse email ${email} est déjà abonnée à la newsletter`);
  }
}
