import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SocialType } from '../users/dto/login.dto';
import { ServiceResponseDto } from '../common/types/service-response-dto';
import { LoginResponseDto } from './types/login-response.dto';
import { Public } from './decorator/public.decorator';
import { RegisterDto } from '../users/dto/register.dto';
import { Roles } from './decorator/role.decorator';
import { UserRole } from '../users/entities/abstract.user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Body() dto: RegisterDto,
  ) {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  @Roles([UserRole.USER])
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Public()
  @Post('login-admin')
  async loginAdmin(
    @Body() dto: LoginDto,
  ) {
    return  await this.auth.loginAdmin(dto);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() body: { token: string }) {
    return await this.auth.refresh(body.token);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() body: { token: string }) {
    return await this.auth.verifyEmail(body.token);
  }

  @Public()
  @Post('social-login')
  async socialLogin(@Body() socialDto: { accessToken: string; type: SocialType, name?: string }) {
    return await this.auth.socialLogin(socialDto);
  }


  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return await this.auth.forgotPassword(body.email);
  }


  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { password: string; token: string }) {
    return await this.auth.resetPassword(body);
  }

  // TODO: Should get user id from AuthGuard
  @Roles([UserRole.USER, UserRole.BUSINESS_USER])
  @Post('change-password')
  async changePassword(
    @Body()
    body: {
      id: string;
      oldPassword: string;
      newPassword: string;
      otp: string;
    },
  ) {
    return await this.auth.changePassword(body);
  }

  // TODO: Should get user id from AuthGuard

  @Post('set-password')
  async setPassword(
    @Body() body: { id: string; password: string; otp: string },
  ) {
    return await this.auth.setPassword(body);
  }
}
