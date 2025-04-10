import * as fs from 'fs';
import * as path from 'path';
import { InvalidEmailAddress } from 'src/application/exceptions/user.exceptions';
import { IEmailValidator } from 'src/domain/interfaces/email-validator';

export class EmailValidator implements IEmailValidator {
  private disposableDomains: Set<string>;

  constructor() {
    const filePath = path.join(
      __dirname,
      '../data/disposable_email_blocklist.conf',
    );
    const raw = fs.readFileSync(filePath, 'utf8');
    this.disposableDomains = new Set(
      raw
        .split('\n')
        .map((line) => line.trim().toLowerCase())
        .filter(Boolean),
    );
  }

  isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domain = email.split('@')[1]?.toLowerCase();
    if (this.disposableDomains.has(domain)) {
      throw new InvalidEmailAddress(email);
    }
    return emailRegex.test(email);
  }
}
