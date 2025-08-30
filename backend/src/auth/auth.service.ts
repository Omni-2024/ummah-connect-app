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


import { JwtPayload } from './types/jwt-payload.type';
import { LoginResponseDto } from './types/login-response.dto';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from '../users/dto/login.dto';
import { SigninMethod, UserRole } from '../users/entities/abstract.user.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserRepository } from '../users/user.repository';
import { ServiceResponseDto } from '../common/types/service-response-dto';
import { EmailService } from '../common/email/email.service';
import { log } from 'console';

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
    private readonly emailService: EmailService

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
      this.config.get<string>('JWT_VERIFY_SECRET')!;
    this.verifyExpires = this.config.get<string>('JWT_VERIFY_EXPIRES') || '1d';
    this.appBaseUrl = this.config.get<string>('APP_BASE_URL') || '';
  }

  async register(registerDto: RegisterDto): Promise<ServiceResponseDto<LoginResponseDto>> {
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

      const newUser:UserEntity = await this.userRepo.register(registerDto, emailToken);

      const link =`${this.appBaseUrl}/verify-email?token=${emailToken}`


      await this.emailService.sendEmailConformation(
      {
        name:newUser.name,
        email,
        link
      })

      // const customer: CreateCustomerDto = {
      //   userId: newUser.id,
      //   email: newUser.email,
      //   name: newUser.name,
      // };
      //
      // await this.stripeService.createCustomer(customer);

      return { status: HttpStatus.CREATED };
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, error };
    }
  }

  async verifyEmail(token: string): Promise<ServiceResponseDto<void>> {
    const { email } = await this.jwtService.verifyAsync<{ email: string }>(token, {
      secret: this.verifySecret,
    });
    const user = await this.userRepo.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (token === user.token) {
      user.verified = true;
      user.token = '';
      await this.userRepo.update(user);

      //TODO : Welcome Email
      return { status: HttpStatus.OK };
    }
    return { status: HttpStatus.NOT_ACCEPTABLE };

  }

  async login(dto: LoginDto) {
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


      const token = await  this.generateToken(user);

      return token.data
  }

  async loginAdmin(dto: LoginDto) {
    const user = await this.userRepo.findOneByEmail(dto.email);
    if (!user) throw new NotFoundException('User not Found');

    if (!(await this.checkRole(user, [UserRole.ROOT, UserRole.ADMIN, UserRole.OPERATIONAL_ADMIN])))
      throw new UnauthorizedException('Unauthorized access');

    if (!(await user.comparePassword(dto.password)))
      throw new UnauthorizedException('Invalid credentials');

    if (user.active === false)
      throw new ForbiddenException('User has been Blocked');

    if (user.verified === false)
      throw new BadRequestException('User Email has not been verified');

    const token = await  this.generateToken(user);

    return token.data


  }


  async refresh(token: string) {
    try {
      const { rtSecret } = this.refreshTokenCfg;

      const payload: JwtPayload = await this.jwtService.verifyAsync(token, { secret: rtSecret });

      const user = await this.userRepo.findOneById(payload.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const genToken = await  this.generateToken(user);

      return genToken.data

    } catch (error) {
      return { status: HttpStatus.UNAUTHORIZED, error };
    }
  }

  async validateToken(token: string): Promise<ServiceResponseDto<JwtPayload>> {
    try {
      const { atSecret,atExpires } = this.accessToken;
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret:atSecret,
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


  async generateToken(user: UserEntity): Promise<ServiceResponseDto<LoginResponseDto>> {
    try {
      const { rtSecret,rtExpires } = this.refreshTokenCfg;
      const { atSecret,atExpires } = this.accessToken;

      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const token = await this.jwtService.signAsync(payload,{
        expiresIn:atExpires,
        secret:atSecret,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn:rtExpires,
        secret:rtSecret,
      });

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
