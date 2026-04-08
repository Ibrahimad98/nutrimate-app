import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserBodyProfileService } from './user-body-profile.service';
import { UserBodyProfileController } from './user-body-profile.controller';
import { UserBodyProfile } from './entities/user-body-profile.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBodyProfile]),
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'nutrimate-secret-key'),
      }),
    }),
  ],
  controllers: [UserBodyProfileController],
  providers: [UserBodyProfileService],
  exports: [UserBodyProfileService],
})
export class UserBodyProfileModule {}
