import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UserBodyProfile } from '../user-body-profile/entities/user-body-profile.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_NAME', 'nutrimate-db'),
  entities: [User, UserBodyProfile],
  synchronize: configService.get<string>('DB_SYNC', 'false') === 'true',
  logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
});
