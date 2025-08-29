import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtAtStrategy } from './jwt/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/role.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    JwtAtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
