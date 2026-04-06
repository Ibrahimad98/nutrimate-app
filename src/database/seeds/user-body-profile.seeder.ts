import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import {
  UserBodyProfile,
  Gender,
  ActivityLevel,
} from '../../user-body-profile/entities/user-body-profile.entity';

export default class UserBodyProfileSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const profileRepository = dataSource.getRepository(UserBodyProfile);

    const profilesData = [
      {
        email: 'admin@nutrimate.com',
        profile: {
          heightCm: 175.0,
          weightKg: 70.0,
          dateOfBirth: '1990-01-15',
          gender: Gender.MALE,
          activityLevel: ActivityLevel.MODERATE,
        },
      },
      {
        email: 'user@nutrimate.com',
        profile: {
          heightCm: 162.5,
          weightKg: 55.0,
          dateOfBirth: '1995-06-20',
          gender: Gender.FEMALE,
          activityLevel: ActivityLevel.LIGHT,
        },
      },
    ];

    for (const { email, profile } of profilesData) {
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        console.log(`⚠️  User not found for email: ${email}, skipping profile`);
        continue;
      }

      const exists = await profileRepository.findOne({
        where: { userId: user.id },
      });

      if (!exists) {
        const bodyProfile = profileRepository.create({
          userId: user.id,
          ...profile,
        });
        await profileRepository.save(bodyProfile);
        console.log(`✅ Seeded body profile for: ${email}`);
      } else {
        console.log(`⏭️  Skipped (already exists): body profile for ${email}`);
      }
    }
  }
}
