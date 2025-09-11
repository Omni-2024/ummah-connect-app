import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/entities/user.entity';
import { EmailModule } from './common/email/email.module';
import { ServiceModule } from './services/services.module';
import { ProfessionModule } from './categories/profession/profession.module';
import { SpecialistModule } from './categories/specialist/specialist.module';
import { CategoryModule } from './categories/categories.module';
import { ReviewModule } from './review/review.module';
import { StorageModule } from './common/r2/storage.module';
import { ProviderModule } from './providers/provider.module';
import { StreamModule } from './common/getStream/stream.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '1000', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [UserEntity],
        // synchronize: false,
        autoLoadEntities: true,
        synchronize: true, 
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
    UsersModule,
    AuthModule,
    EmailModule,
    ServiceModule,
    CategoryModule,
    ProfessionModule,
    SpecialistModule,
    ReviewModule,
    StorageModule,
    ProviderModule,
    StreamModule
  ],
})
export class AppModule {}
