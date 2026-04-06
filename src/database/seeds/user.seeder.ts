import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/entities/user.entity';

export default class UserSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(User);

    const users = [
      {
        email: 'admin@nutrimate.com',
        password: await bcrypt.hash('Admin@1234', 10),
        name: 'Admin NutriMate',
        role: UserRole.ADMIN,
        isActive: true,
      },
      {
        email: 'user@nutrimate.com',
        password: await bcrypt.hash('User@1234', 10),
        name: 'Sample User',
        role: UserRole.USER,
        isActive: true,
      },
    ];

    for (const userData of users) {
      const exists = await repository.findOne({
        where: { email: userData.email },
      });

      if (!exists) {
        const user = repository.create(userData);
        await repository.save(user);
        console.log(`✅ Seeded user: ${userData.email}`);
      } else {
        console.log(`⏭️  Skipped (already exists): ${userData.email}`);
      }
    }
  }
}
