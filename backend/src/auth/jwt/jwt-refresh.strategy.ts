// src/auth/jwt/jwt-refresh.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService, private users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refreshToken = (req.body?.refresh_token as string) || '';
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');
    const isValid = await this.users.compareRefreshToken(payload.sub, refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');
    return { sub: payload.sub };
  }
}
