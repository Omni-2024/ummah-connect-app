import {
  BadRequestException, ConflictException,
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
import { LoginDto, SocialType } from '../users/dto/login.dto';
import { SigninMethod, UserRole } from '../users/entities/abstract.user.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserRepository } from '../users/user.repository';
import { ServiceResponseDto } from '../common/types/service-response-dto';
import { EmailService } from '../common/email/email.service';
import { log } from 'console';
import { StreamService } from '../common/getStream/stream.service';
import { GoogleService } from './social/google.service';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { SetPasswordDto } from '../users/dto/set-password.dto';
import { CreateCustomerDto } from '../common/stripe/dto/strip.dto';
import { StripeService } from '../common/stripe/stripe.service';

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
    private readonly emailService: EmailService,
    private readonly streamService: StreamService,
    private readonly googleService: GoogleService,
    private readonly stripeService:StripeService


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
      const { email } = registerDto;

      let user: UserEntity | null = null;
      try {
        user = await this.userRepo.findOneByEmail(email);
      } catch (err) {
        if (!(err instanceof NotFoundException)) {
          return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'An unknown error occurred' };
        }
      }
      if (user)  throw new ConflictException('User with this email already exists');

      const emailToken = await this.jwtService.signAsync(
        { email },
        { expiresIn: this.verifyExpires, secret: this.verifySecret },
      );

      const newUser:UserEntity = await this.userRepo.register(registerDto, emailToken);

      await this.streamService.upsertUser(newUser.id, newUser.name ?? email, newUser.role);


    const link =`${this.appBaseUrl}/verify-email?token=${emailToken}`


      await this.emailService.sendEmailConformation(
      {
        name:newUser.name,
        email,
        link
      })

      const customer: CreateCustomerDto = {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };
      await this.stripeService.createCustomer(customer);

      return { status: HttpStatus.CREATED };
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

  async socialLogin({
                      accessToken,
                      type,
                      name,
                    }: { accessToken: string; type: SocialType, name?: string }) {
    switch (type) {
      case SocialType.GOOGLE:
        return this.googleService.login(accessToken);
      default:
        throw new Error('Invalid social type');
    }
  }

  async loginAdmin(dto: LoginDto) {
    const user = await this.userRepo.findOneByEmail(dto.email);
    if (!user) throw new NotFoundException('User not Found');

    if (!(await this.checkRole(user, [UserRole.ROOT, UserRole.ADMIN, UserRole.BUSINESS_ADMIN])))
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

  async verifyOtp(
    otp: string,
    userOtp: string,
    otpExpires: Date,
  ): Promise<boolean> {
    if (otp !== userOtp) {
      return false;
    }
    if (new Date() > otpExpires) {
      return false;
    }
    return true;
  }

  async forgotPassword(email: string) {
      const user = await this.userRepo.findOneByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.signinMethod === SigninMethod.SOCIAL) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Please use social login to access your account',
        };
      }

      const emailToken = await this.jwtService.signAsync(
        { email },
        { expiresIn: this.verifyExpires, secret: this.verifySecret },
      );

      user.token = emailToken;
      await this.userRepo.update(user);

      const link=`${this.appBaseUrl}/reset-password?token=${emailToken}`

      const test=await this.emailService.sendEmailConformation(
        {
          name:user.name,
          email,
          link
        })

      return { status: HttpStatus.OK };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ){
      const { password, token } = resetPasswordDto;
      const { email } = await this.jwtService.verifyAsync(token, { secret:this.verifySecret });
      const user = await this.userRepo.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.signinMethod === SigninMethod.SOCIAL) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Please use social login to access your account',
        };
      }

      if (user.token === token) {
        user.password = password;
        user.token = '';
        user.signinMethod = SigninMethod.EMAIL;
        await user.hashPassword();
        await this.userRepo.update(user);
        return { status: HttpStatus.OK };
      }
      return {
        status: HttpStatus.NOT_ACCEPTABLE,
        error:
          'Your password reset link has expired. Please request a new one from the login page',
      };

  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ) {
      const { oldPassword, newPassword, id, otp } = changePasswordDto;
      const user = await this.userRepo.findOneById(id);
      if (!user) {
        return { status: HttpStatus.NOT_FOUND, error: 'User not found' };
      }

      // TODO: verify otp
      const isOtpValid = await this.verifyOtp(otp, user.otp, user.otpExpires);
      if (!isOtpValid) {
        return { status: HttpStatus.NOT_ACCEPTABLE, error: 'Invalid OTP' };
      }

      const isValid = await user.comparePassword(oldPassword);
      if (!isValid) {
        return { status: HttpStatus.NOT_ACCEPTABLE, error: 'Invalid Password' };
      }
      user.password = newPassword;
      user.otp = '';
      await user.hashPassword();
      await this.userRepo.update(user);
      return { status: HttpStatus.OK };
  }

  async setPassword(
    setPasswordDto: SetPasswordDto,
  ) {
      const { password, id, otp } = setPasswordDto;
      const user = await this.userRepo.findOneById(id);
      if (!user) {
        return { status: HttpStatus.NOT_FOUND, error: 'User not found' };
      }

      // If user is not a social user, they are not allowed to set password
      if (user.signinMethod !== SigninMethod.SOCIAL) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: 'User is not allowed to set password',
        };
      }

      // TODO: verify otp
      const isOtpValid = await this.verifyOtp(otp, user.otp, user.otpExpires);
      if (!isOtpValid) {
        return { status: HttpStatus.NOT_ACCEPTABLE, error: 'Invalid OTP' };
      }

      user.password = password;
      user.signinMethod = SigninMethod.EMAIL;
      await user.hashPassword();
      await this.userRepo.update(user);
      return { status: HttpStatus.OK };
  }


  async checkRole(user: UserEntity, roles: UserRole[]): Promise<boolean> {
    return roles.includes(user.role);
  }
}
