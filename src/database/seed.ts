import 'dotenv/config';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { User } from '../users/entities/user.entity';
import { UserBodyProfile } from '../user-body-profile/entities/user-body-profile.entity';
import UserSeeder from './seeds/user.seeder';
import UserBodyProfileSeeder from './seeds/user-body-profile.seeder';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nutrimate-db',
  entities: [User, UserBodyProfile],
  synchronize: false,
});

dataSource
  .initialize()
  .then(async () => {
    console.log('🌱 Running seeders...');
    await runSeeders(dataSource, {
      seeds: [UserSeeder, UserBodyProfileSeeder],
    });
    console.log('✅ Seeding completed!');
    await dataSource.destroy();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
