import { BaseExceptions } from './base-exceptions';

export class InvalidEmailAddress extends BaseExceptions {
  constructor(email: string) {
    super(400, `L'adresse email ${email} n'est pas une adresse valide`);
  }
}

export class UserAlreadyExists extends BaseExceptions {
  constructor(email: string) {
    super(400, `L'adresse email ${email} est déjà utilisée`);
  }
}
