import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { ITempGoogleAuthRoleRepository } from 'src/domain/interfaces/temp-google-auth-role.repository';
import googleOauthConfig from '../config/google-auth.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    @Inject('IAuthService')
    private authService: IAuthService,
    @Inject('ITempGoogleAuthRoleRepository')
    private tempGoogleAuthRoleRepository: ITempGoogleAuthRoleRepository,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.redirectUrl,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile?.emails?.[0]?.value ?? '';

    const user = await this.authService.validateGoogleUser({
      email: email,
      role: UserRole.GUEST,
      isVerified: profile?.emails?.[0]?.verified ?? false,
    });

    done(null, user);
  }
}
