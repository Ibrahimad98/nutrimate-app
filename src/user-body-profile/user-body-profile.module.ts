import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBodyProfileService } from './user-body-profile.service';
import { UserBodyProfileController } from './user-body-profile.controller';
import { UserBodyProfile } from './entities/user-body-profile.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBodyProfile]),
    UsersModule,
  ],
  controllers: [UserBodyProfileController],
  providers: [UserBodyProfileService],
  exports: [UserBodyProfileService],
})
export class UserBodyProfileModule {}
