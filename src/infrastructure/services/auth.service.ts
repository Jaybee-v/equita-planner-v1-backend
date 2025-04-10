import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IAuthService } from 'src/domain/interfaces/auth.service';
@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signin(credentials: UserEntity): Promise<string> {
    const token = await this.generateToken(credentials);
    return token;
  }

  private async generateToken(user: UserEntity): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_TOKEN_EXPIRATION,
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
