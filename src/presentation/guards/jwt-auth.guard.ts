import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IS_RIDER_KEY } from '../decorators/rider.decorator';
import { IS_STABLE_KEY } from '../decorators/stable.decorator';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const isRider = this.reflector.getAllAndOverride<boolean>(IS_RIDER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isStable = this.reflector.getAllAndOverride<boolean>(IS_STABLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtUserPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;

      if (isRider) {
        if ((request['user'] as { role?: string }).role !== 'RIDER') {
          throw new UnauthorizedException();
        }
      }

      if (isStable) {
        console.log(request['user']);
        if ((request['user'] as { role?: string }).role !== 'STABLE') {
          throw new UnauthorizedException();
        }
      }

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
