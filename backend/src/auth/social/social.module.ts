import { forwardRef, Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthModule } from '../auth.module';
import { UsersService } from '../../users/users.service';
import { UsersModule } from '../../users/users.module';
import { StreamModule } from '../../common/getStream/stream.module';
import { StripeModule } from '../../common/stripe/stripe.module';


@Module({
  imports: [forwardRef(() => AuthModule),UsersModule,StreamModule,StripeModule],
  providers: [
    GoogleService,
    UsersService,
  ],
  exports: [GoogleService],
})
export class SocialModule { }
