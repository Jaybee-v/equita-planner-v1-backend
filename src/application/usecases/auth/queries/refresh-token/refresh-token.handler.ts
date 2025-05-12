import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { RefreshTokenQuery } from './refresh-token.query';

@Injectable()
export class RefreshTokenHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  async execute(
    query: RefreshTokenQuery,
  ): Promise<{ token: string; refreshToken: string }> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.authService.createTokens(user);

    return tokens;
  }
}
