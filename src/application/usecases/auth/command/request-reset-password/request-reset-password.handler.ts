import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { IEmailService } from 'src/domain/interfaces/services/email.service';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { RequestResetPasswordCommand } from './request-reset-password.command';

@Injectable()
export class RequestResetPasswordHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {}

  async execute(command: RequestResetPasswordCommand): Promise<void> {
    const { email } = command;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return;
    }

    const tokens = await this.authService.createTokens(user);

    const { token, refreshToken } = tokens;

    const URL = `${process.env.FRONTEND_URL}/auth/reset-password?accessToken=${token}&refreshToken=${refreshToken}`;

    await this.emailService.resetPasswordEmail({
      email: user.email,
      url: URL,
    });
  }
}
