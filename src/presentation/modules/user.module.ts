import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginHandler } from 'src/application/usecases/auth/queries/login/login.handler';
import { CreateUserHandler } from 'src/application/usecases/user/commands/create-user/create-user.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { UserRepository } from 'src/infrastructure/persistence/user.repository';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { EmailValidator } from 'src/infrastructure/services/email-validator.service';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';

@Module({
  imports: [],
  controllers: [UserController, AuthController],
  providers: [
    CreateUserHandler,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IEmailValidator',
      useClass: EmailValidator,
    },
    { provide: 'IAuthService', useClass: AuthService },
    LoginHandler,
    JwtService,
    PrismaService,
  ],
  exports: ['IUserRepository', 'IEmailValidator'],
})
export class UserModule {}
