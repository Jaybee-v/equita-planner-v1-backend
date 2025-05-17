import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestResetPasswordHandler } from 'src/application/usecases/auth/command/request-reset-password/request-reset-password.handler';
import { ResetPasswordHandler } from 'src/application/usecases/auth/command/reset-password/reset-password.handler';
import { UpdatePasswordHandler } from 'src/application/usecases/auth/command/update-password/update-password.handler';
import { FindMeHandler } from 'src/application/usecases/auth/queries/find-me/find-me.handler';
import { LoginHandler } from 'src/application/usecases/auth/queries/login/login.handler';
import { RefreshTokenHandler } from 'src/application/usecases/auth/queries/refresh-token/refresh-token.handler';
import { DeleteUserHandler } from 'src/application/usecases/user/commands/delete-user/delete-user.handler';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Public } from '../decorators/public.decorator';
import { GoogleAuthGuard } from '../guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginHandler,
    private readonly findMeUseCase: FindMeHandler,
    private readonly refreshTokenUseCase: RefreshTokenHandler,
    private readonly updatePasswordUseCase: UpdatePasswordHandler,
    private readonly deleteUserUseCase: DeleteUserHandler,
    private readonly requestResetPasswordUseCase: RequestResetPasswordHandler,
    private readonly resetPasswordUseCase: ResetPasswordHandler,
  ) {}

  @Public()
  @HttpCode(200)
  @Post('signin')
  async signin(@Body() credentials: { email: string; password: string }) {
    const tokens = await this.loginUseCase.execute(credentials);
    return tokens;
  }

  @HttpCode(200)
  @Get('/me')
  async me(@Req() req: Request & { user: JwtUserPayload }) {
    return await this.findMeUseCase.execute({ userId: req.user.sub });
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request & { user: JwtUserPayload }) {
    return await this.refreshTokenUseCase.execute({ userId: req.user.sub });
  }

  @Public()
  @HttpCode(200)
  @Post('request-reset-password')
  async requestResetPassword(@Body() body: { email: string }) {
    console.log('requestResetPassword', body);
    return await this.requestResetPasswordUseCase.execute({
      email: body.email,
    });
  }

  @HttpCode(200)
  @Patch('reset-password')
  async resetPassword(
    @Body() body: { password: string },
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    if (body.password.length < 8) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    }

    await this.resetPasswordUseCase.execute({
      password: body.password,
      requestedBy: req.user.sub,
    });

    return {
      success: true,
    };
  }

  @HttpCode(200)
  @Put('update-password')
  async updatePassword(
    @Req() req: Request & { user: JwtUserPayload },
    @Body() body: { password: string; userId: string },
  ) {
    await this.updatePasswordUseCase.execute({
      userId: body.userId,
      password: body.password,
      handledBy: req.user.sub,
    });
    return {
      message: 'Votre mot de passe a été mis à jour avec succès',
    };
  }

  @HttpCode(200)
  @Delete('delete-user')
  async deleteUser(
    @Req() req: Request & { user: JwtUserPayload },
    @Body() body: { password: string; userId: string },
  ) {
    await this.deleteUserUseCase.execute({
      userId: body.userId,
      password: body.password,
      handledBy: req.user.sub,
    });
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: Request & { user: { _email: string } },
    @Res() res: Response,
  ) {
    const response = await this.loginUseCase.execute({
      email: req.user._email,
      password: '',
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/signin?token=${response.token}&refreshToken=${response.refreshToken}`,
    );
  }
}
