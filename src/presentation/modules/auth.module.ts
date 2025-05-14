import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RequestResetPasswordHandler } from 'src/application/usecases/auth/command/request-reset-password/request-reset-password.handler';
import { ResetPasswordHandler } from 'src/application/usecases/auth/command/reset-password/reset-password.handler';
import { UpdatePasswordHandler } from 'src/application/usecases/auth/command/update-password/update-password.handler';
import { FindMeHandler } from 'src/application/usecases/auth/queries/find-me/find-me.handler';
import { LoginHandler } from 'src/application/usecases/auth/queries/login/login.handler';
import { RefreshTokenHandler } from 'src/application/usecases/auth/queries/refresh-token/refresh-token.handler';
import { DeleteUserHandler } from 'src/application/usecases/user/commands/delete-user/delete-user.handler';
import googleOauthConfig from 'src/infrastructure/config/google-auth.config';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { TempGoogleAuthRoleRepository } from 'src/infrastructure/persistence/temp-google-auth-role.repository';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { GoogleStrategy } from 'src/infrastructure/strategies/google.strategy';
import { AuthController } from '../controllers/auth.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { EmailModule } from './email.module';
import { InstructorModule } from './instructor.module';
import { RiderModule } from './rider.module';
import { StableModule } from './stable.module';
import { UserModule } from './user.module';
@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => RiderModule),
    forwardRef(() => StableModule),
    // InstructorModule,
    forwardRef(() => InstructorModule),
    EmailModule,
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'IAuthService', useClass: AuthService },
    GoogleStrategy,
    // CreateTempGoogleAuthRoleHandler,
    {
      provide: 'ITempGoogleAuthRoleRepository',
      useClass: TempGoogleAuthRoleRepository,
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    LoginHandler,
    FindMeHandler,
    RefreshTokenHandler,
    UpdatePasswordHandler,
    RequestResetPasswordHandler,
    DeleteUserHandler,
    ResetPasswordHandler,
    PrismaService,
    JwtService,
  ],
  exports: [
    'IAuthService',
    JwtService,
    ResetPasswordHandler,
    LoginHandler,
    FindMeHandler,
    RefreshTokenHandler,
    UpdatePasswordHandler,
    DeleteUserHandler,
    RequestResetPasswordHandler,
  ],
})
export class AuthModule {}
