// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@GetUser() user: User) {
    // return public-safe user fields
    const { password, salt, token, otp, otp_expires, ...safe } = user as any;
    return safe;
  }
}
