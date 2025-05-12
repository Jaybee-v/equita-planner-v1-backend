import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PreRegistrationAlreadyExists } from 'src/application/exceptions/pre-registration.exceptions';
import { InvalidEmailAddress } from 'src/application/exceptions/user.exceptions';
import { PreRegistrationEntity } from 'src/domain/entities/pre-registration.entity';
import { IEmailValidator } from 'src/domain/interfaces/email-validator';
import { IPreRegistrationRepository } from 'src/domain/interfaces/pre-registration.repository';
import { CreatePreRegistrationCommand } from './create-pre-registration.command';

@Injectable()
export class CreatePreRegistrationHandler {
  constructor(
    @Inject('IPreRegistrationRepository')
    private readonly preRegistrationRepository: IPreRegistrationRepository,
    @Inject('IEmailValidator')
    private readonly emailValidator: IEmailValidator,
  ) {}

  async execute(
    command: CreatePreRegistrationCommand,
  ): Promise<PreRegistrationEntity> {
    try {
      const isValidEmail = this.emailValidator.isValid(command.email);
      if (!isValidEmail) {
        throw new InvalidEmailAddress(command.email);
      }
      const newPreReggistration = PreRegistrationEntity.create(command.email);
      const preRegistration =
        await this.preRegistrationRepository.create(newPreReggistration);

      return preRegistration;
    } catch (error) {
      if (error instanceof InvalidEmailAddress) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof PreRegistrationAlreadyExists) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
