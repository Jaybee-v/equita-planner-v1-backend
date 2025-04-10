import { Body, Controller, Post } from '@nestjs/common';
import { LoginHandler } from 'src/application/usecases/auth/queries/login/login.handler';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginHandler) {}

  @Post('signin')
  async signin(@Body() credentials: { email: string; password: string }) {
    const token = await this.loginUseCase.execute(credentials);
    return { token };
  }
}
