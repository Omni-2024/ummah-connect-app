// src/auth/auth.service.ts
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import { JwtPayload } from './types/jwt-payload.type';
import { LoginResponseDto } from './types/login-response.dto';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from '../users/dto/login.dto';
import { SigninMethod, UserRole } from '../users/entities/abstract.user.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserRepository } from '../users/user.repository';
import { ServiceResponseDto } from '../common/types/service-response-dto';

type AtCfg = { atSecret: string; atExpires: string };
type RtCfg = { rtSecret: string; rtExpires: string };

@Injectable()
export class AuthService {
  private readonly accessToken: AtCfg;
  private readonly refreshTokenCfg: RtCfg;
  private readonly verifySecret: string;
  private readonly verifyExpires: string;
  private readonly appBaseUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    this.accessToken = {
      atSecret: this.config.get<string>('JWT_ACCESS_SECRET')!,
      atExpires: this.config.get<string>('JWT_ACCESS_EXPIRES') || '15m',
    };
    this.refreshTokenCfg = {
      rtSecret: this.config.get<string>('JWT_REFRESH_SECRET')!,
      rtExpires: this.config.get<string>('JWT_REFRESH_EXPIRES') || '7d',
    };
    this.verifySecret =
      this.config.get<string>('JWT_VERIFY_SECRET') || this.refreshTokenCfg.rtSecret;
    this.verifyExpires = this.config.get<string>('JWT_VERIFY_EXPIRES') || '15m';
    this.appBaseUrl = this.config.get<string>('APP_BASE_URL') || '';
  }

  async register(registerDto: RegisterDto): Promise<ServiceResponseDto<void>> {
    try {
      const { email } = registerDto;

      let user: UserEntity | null = null;
      try {
        user = await this.userRepo.findOneByEmail(email);
      } catch (err) {
        if (!(err instanceof NotFoundException)) {
          return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'An unknown error occurred' };
        }
      }
      if (user) return { status: HttpStatus.CONFLICT, error: 'User already exists' };

      const emailToken = await this.jwtService.signAsync(
        { email },
        { expiresIn: this.verifyExpires, secret: this.verifySecret },
      );

      console.log("Email",emailToken);

      const app =await this.userRepo.register(registerDto, emailToken);


      console.log(app);

      return { status: HttpStatus.CREATED };
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, error };
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const { email } = await this.jwtService.verifyAsync<{ email: string }>(token, {
      secret: this.verifySecret,
    });
    const user = await this.userRepo.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.token !== token) throw new BadRequestException('Invalid or expired token');

    user.verified = true;
    user.token = '';
    await this.userRepo.update(user);
  }

  async login(dto: LoginDto): Promise<ServiceResponseDto<LoginResponseDto>> {
    try {
      const user = await this.userRepo.findOneByEmail(dto.email);
      if (!user) throw new UnauthorizedException('Invalid credentials');
      if (user.signinMethod === SigninMethod.SOCIAL)
        throw new UnauthorizedException('Use social login');

      if (
        !(await this.checkRole(user, [
          UserRole.USER,
          UserRole.BUSINESS_ADMIN,
          UserRole.BUSINESS_USER,
        ]))
      ) {
        throw new UnauthorizedException('Unauthorized access');
      }

      if (!(await user.comparePassword(dto.password)))
        throw new UnauthorizedException('Invalid credentials');
      if (!user.active) throw new ForbiddenException('User blocked');
      if (!user.verified) throw new BadRequestException('Email not verified');

      return this.generateToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException)
        return { status: HttpStatus.UNAUTHORIZED, error };
      if (error instanceof ForbiddenException)
        return { status: HttpStatus.FORBIDDEN, error };
      if (error instanceof BadRequestException)
        return { status: HttpStatus.BAD_REQUEST, error };
      if (error instanceof NotFoundException)
        return { status: HttpStatus.NOT_FOUND, error };
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error };
    }
  }

  async loginAdmin(dto: LoginDto): Promise<ServiceResponseDto<LoginResponseDto>> {
    try {
      const user = await this.userRepo.findOneByEmail(dto.email);
      if (!user) throw new UnauthorizedException('user not Found');

      if (
        !(await this.checkRole(user, [UserRole.ROOT, UserRole.ADMIN, UserRole.OPERATIONAL_ADMIN]))
      ) {
        throw new UnauthorizedException('Unauthorized access');
      }

      if (!(await user.comparePassword(dto.password)))
        throw new UnauthorizedException('Invalid credentials');
      if (user.active === false) throw new ForbiddenException('User has been Blocked');
      if (user.verified === false)
        throw new BadRequestException('User Email has not been verified');

      return this.generateToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException)
        return { status: HttpStatus.UNAUTHORIZED, error };
      if (error instanceof ForbiddenException)
        return { status: HttpStatus.FORBIDDEN, error };
      if (error instanceof BadRequestException)
        return { status: HttpStatus.BAD_REQUEST, error };
      if (error instanceof NotFoundException)
        return { status: HttpStatus.NOT_FOUND, error };
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error };
    }
  }

  // ---------- Refresh with verification + rotation ----------
  async refresh(token: string): Promise<ServiceResponseDto<LoginResponseDto>> {
    try {
      const { rtSecret } = this.refreshTokenCfg;

      // 1) Verify the RT signature to get the payload
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, { secret: rtSecret });

      // 2) Fetch user and compare provided RT with stored hash
      const user = await this.userRepo.findOneById(payload.id);
      if (!user) throw new NotFoundException('User not found');
      if (!user.token) return { status: HttpStatus.UNAUTHORIZED, error: 'No active session' };

      const matches = await bcrypt.compare(token, user.token);
      if (!matches) return { status: HttpStatus.UNAUTHORIZED, error: 'Invalid refresh token' };

      // 3) Rotate RT and return new pair
      return this.generateToken(user);
    } catch (error) {
      return { status: HttpStatus.UNAUTHORIZED, error };
    }
  }

  async validateToken(token: string): Promise<ServiceResponseDto<JwtPayload>> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.accessToken.atSecret,
      });
      const user = await this.userRepo.findOneVerifiedById(payload.id);
      if (!user) throw new NotFoundException('User not found');
      return { status: HttpStatus.OK, data: { email: user.email, id: user.id, role: user.role } };
    } catch (error) {
      if (error instanceof NotFoundException)
        return { status: HttpStatus.UNAUTHORIZED, error };
      return { status: HttpStatus.UNAUTHORIZED, error };
    }
  }

  // async logout(userId: string): Promise<ServiceResponseDto<void>> {
  //   await this.userRepo.setRefreshToken(userId, null);
  //   return { status: HttpStatus.OK };
  // }

  private async issueTokens(user: UserEntity) {
    const atPayload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const { atSecret, atExpires } = this.accessToken;
    const { rtSecret, rtExpires } = this.refreshTokenCfg;

    const token = await this.jwtService.signAsync(atPayload, {
      secret: atSecret,
      expiresIn: atExpires,
    });
    const refreshToken = await this.jwtService.signAsync(atPayload, {
      secret: rtSecret,
      expiresIn: rtExpires,
    });
    return { token, refreshToken };
  }

  private async saveRt(userId: string, refreshToken: string) {
    const token = await bcrypt.hash(refreshToken, 12);
    await this.userRepo.setRefreshToken(userId, token);
  }

  async generateToken(user: UserEntity): Promise<ServiceResponseDto<LoginResponseDto>> {
    try {
      const { token, refreshToken } = await this.issueTokens(user);
      await this.saveRt(user.id, refreshToken);

      return {
        status: HttpStatus.OK,
        data: {
          token,
          refreshToken,
          id: user.id,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
        },
      };
    } catch {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'An unknown error occurred' };
    }
  }

  async checkRole(user: UserEntity, roles: UserRole[]): Promise<boolean> {
    return roles.includes(user.role);
  }
}
