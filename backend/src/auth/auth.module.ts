import { Module, Scope } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { UmmahCommunityGuard } from './guard/ummahCommunity.guard';
import { UserPayloadService } from './user.payload.service';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    EmailModule
  ],
  providers: [
    AuthService,
    { provide: APP_GUARD,
      useClass: UmmahCommunityGuard,
      scope: Scope.REQUEST,
    },
    UserPayloadService
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [AuthController],
  exports:[UserPayloadService]
})
export class AuthModule {}
