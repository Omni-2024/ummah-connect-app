// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: { name?: string; email: string; password: string }) {
    const user = await this.users.create(dto);
    const tokens = await this.issueTokens(user._id, user.email, user.role);
    await this.users.setRefreshToken(user._id, tokens.refresh_token);
    return { user: await this.users.getById(user._id), ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email, true);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(user._id, user.email, user.role);
    await this.users.setRefreshToken(user._id, tokens.refresh_token);
    const safeUser = await this.users.getById(user._id);
    return { user: safeUser, ...tokens };
  }

  async logout(userId: string) {
    await this.users.setRefreshToken(userId, null);
    return { success: true };
  }

  async refresh(userId: string, refreshToken: string) {
    const isValid = await this.users.compareRefreshToken(userId, refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');
    const user = await this.users.getById(userId);
    const tokens = await this.issueTokens(user._id, user.email, user.role);
    await this.users.setRefreshToken(user._id, tokens.refresh_token);
    return tokens;
  }

  private async issueTokens(sub: string, email: string, role: string) {
    const atSecret = this.config.get<string>('JWT_ACCESS_SECRET');
    const rtSecret = this.config.get<string>('JWT_REFRESH_SECRET');

    const payload = { sub, email, role };

    const access_token = await this.jwt.signAsync(payload, {
      secret: atSecret,
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES') || '15m',
    });

    const refresh_token = await this.jwt.signAsync({ sub }, {
      secret: rtSecret,
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES') || '7d',
    });

    return { access_token, refresh_token };
  }
}
