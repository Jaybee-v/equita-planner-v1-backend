import { Inject, Injectable } from '@nestjs/common';
import { InvalidEmailAddress } from 'src/application/exceptions/user.exceptions';
import { UserSettingEntity } from 'src/domain/entities/user-setting.entity';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IEmailValidator } from 'src/domain/interfaces/email-validator';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { IUserSettingRepository } from 'src/domain/interfaces/user-setting.repository';
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
    @Inject('IUserSettingRepository')
    private readonly userSettingRepository: IUserSettingRepository,
  ) {}

  async execute(userDto: CreateUserCommand): Promise<UserEntity> {
    const isValidEmail = this.emailValidator.isValid(userDto.email);
    if (!isValidEmail) {
      throw new InvalidEmailAddress(userDto.email);
    }
    const hashedPassword = await this.authService.hashPassword(
      userDto.password,
    );
    const _user = UserEntity.create({
      email: userDto.email,
      password: hashedPassword,
      role: userDto.role,
      isIndependentInstructor: userDto.isIndependentInstructor,
    });
    const user = await this.userRepository.create(_user);
    const userSetting = UserSettingEntity.create({
      userId: user.id,
      allStableNotifications: true,
      emailNotifications: true,
      pushNotifications: true,
    });
    await this.userSettingRepository.create(userSetting);
    return user;
  }
}
