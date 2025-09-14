import { forwardRef, Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthModule } from '../auth.module';
import { UsersService } from '../../users/users.service';
import { UsersModule } from '../../users/users.module';
import { StreamModule } from '../../common/getStream/stream.module';


@Module({
  imports: [forwardRef(() => AuthModule),UsersModule,StreamModule],
  providers: [
    GoogleService,
    UsersService,
  ],
  exports: [GoogleService],
})
export class SocialModule { }
