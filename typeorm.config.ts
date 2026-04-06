import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { UserBodyProfile } from './src/user-body-profile/entities/user-body-profile.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nutrimate-db',
  entities: [User, UserBodyProfile],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
