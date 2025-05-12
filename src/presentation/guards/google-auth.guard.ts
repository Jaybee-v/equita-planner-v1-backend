import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ITempGoogleAuthRoleRepository } from 'src/domain/interfaces/temp-google-auth-role.repository';
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(
    @Inject('ITempGoogleAuthRoleRepository')
    private readonly tempGoogleAuthRoleRepository: ITempGoogleAuthRoleRepository,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    console.log('REQUEST ===', request);
    // const role = request.query.role;
    // console.log('ROLE ===', role);
    // console.log('REQUEST ===', request.query);

    // if (role) {
    // console.log('ROLE IN LOGIN ===', role);
    // await this.tempGoogleAuthRoleRepository.create(role as UserRole);
    // }

    const result = await super.canActivate(context);
    console.log('RESULT ===', result);
    return result as boolean;
  }
}
