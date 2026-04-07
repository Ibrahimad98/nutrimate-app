import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [InternalController],
  providers: [InternalService],
})
export class InternalModule {}
