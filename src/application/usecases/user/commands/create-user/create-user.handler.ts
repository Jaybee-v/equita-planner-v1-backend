import { Inject, Injectable } from '@nestjs/common';
import { InvalidEmailAddress } from 'src/application/exceptions/user.exceptions';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IAuthService } from 'src/domain/interfaces/auth.service';
import { IEmailValidator } from 'src/domain/interfaces/email-validator';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { CreateUserCommand } from './create-user.command';

@Injectable()
export class CreateUserHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IEmailValidator')
    private readonly emailValidator: IEmailValidator,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  async execute(userDto: CreateUserCommand): Promise<UserEntity> {
    const isValidEmail = this.emailValidator.isValid(userDto.email);
    if (!isValidEmail) {
      throw new InvalidEmailAddress(userDto.email);
    }
    const hashedPassword = await this.authService.hashPassword(
      userDto.password,
    );
    const user = UserEntity.create(userDto.email, hashedPassword);
    console.log(user);
    return this.userRepository.create(user);
  }
}
