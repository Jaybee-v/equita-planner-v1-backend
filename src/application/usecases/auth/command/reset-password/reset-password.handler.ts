import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { ResetPasswordCommand } from './reset-password.command';

@Injectable()
export class ResetPasswordHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}
  async execute(command: ResetPasswordCommand): Promise<void> {
    const { password, requestedBy } = command;

    const user = await this.userRepository.findById(requestedBy);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await this.authService.hashPassword(password);
    await this.userRepository.updateUserPassword(hashedPassword, user.id);
  }
}
