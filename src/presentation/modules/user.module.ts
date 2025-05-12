import { forwardRef, Module } from '@nestjs/common';
import { CreatePreRegistrationHandler } from 'src/application/usecases/pre-registration/commands/create-pre-registration/create-pre-registration.handler';
import { UpdateUserSettingStatusHandler } from 'src/application/usecases/user-setting/commands/update-status/update-status.handler';
import { CreateUserHandler } from 'src/application/usecases/user/commands/create-user/create-user.handler';
import { UpdateUserRoleHandler } from 'src/application/usecases/user/commands/update-user-role/update-user-role.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { PreRegistrationRepository } from 'src/infrastructure/persistence/pre-registration.repository';
import { UserSettingRepository } from 'src/infrastructure/persistence/user-setting.repository';
import { UserRepository } from 'src/infrastructure/persistence/user.repository';
import { EmailValidator } from 'src/infrastructure/services/email-validator.service';
import { AuthController } from '../controllers/auth.controller';
import { PreRegistrationController } from '../controllers/pre-registration.controller';
import { UserController } from '../controllers/user.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController, AuthController, PreRegistrationController],
  providers: [
    CreateUserHandler,
    UpdateUserRoleHandler,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UpdateUserSettingStatusHandler,
    {
      provide: 'IUserSettingRepository',
      useClass: UserSettingRepository,
    },
    {
      provide: 'IEmailValidator',
      useClass: EmailValidator,
    },
    CreatePreRegistrationHandler,
    {
      provide: 'IPreRegistrationRepository',
      useClass: PreRegistrationRepository,
    },

    PrismaService,
  ],
  exports: ['IUserRepository', 'IEmailValidator'],
})
export class UserModule {}
