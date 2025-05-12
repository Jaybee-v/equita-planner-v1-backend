import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { StableEntity } from 'src/domain/entities/stable.entity';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { LoginCommand } from './login.command';

@Injectable()
export class LoginHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(command: LoginCommand): Promise<{
    token: string;
    refreshToken: string;
    user: UserEntity;
    rider: RiderEntity | null;
    stable: StableEntity | null;
  }> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (command.password !== '') {
      const isPasswordValid = await this.authService.comparePassword(
        command.password,
        user.password,
      );

      if (!user.isVerified) {
        throw new UnauthorizedException('Email non vérifié');
      }

      if (!isPasswordValid) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }
    }
    const tokens = await this.authService.signin(user);
    let rider: RiderEntity | null = null;
    let stable: StableEntity | null = null;
    if (user.role === UserRole.RIDER) {
      rider = await this.riderRepository.findByUserId(user.id);
    } else if (user.role === UserRole.STABLE) {
      stable = await this.stableRepository.findByUserId(user.id);
    }
    console.log('USER ===', user);
    console.log('RIDER ===', rider);
    console.log('STABLE ===', stable);
    return { ...tokens, user, rider, stable };
  }
}
