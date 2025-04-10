import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from 'src/domain/interfaces/auth.service';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { LoginCommand } from './login.command';

@Injectable()
export class LoginHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  async execute(command: LoginCommand): Promise<string> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.authService.comparePassword(
      command.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.authService.signin(user);
    return token;
  }
}
