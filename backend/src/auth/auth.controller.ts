// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refresh(@GetUser('sub') sub: string) {
    // JwtRefreshAuthGuard will attach payload incl. refresh token validation
    return this.auth.refresh(sub, (null as any)); // token is validated in guard/strategy
  }

  // optional: you can also expose a logout route guarded by access token
}
