import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBodyProfile } from './entities/user-body-profile.entity';
import { CreateUserBodyProfileDto } from './dto/create-user-body-profile.dto';
import { UpdateUserBodyProfileDto } from './dto/update-user-body-profile.dto';
import { UsersService } from '../users/users.service';

export interface PaginatedBodyProfile {
  items: UserBodyProfile[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class UserBodyProfileService {
  constructor(
    @InjectRepository(UserBodyProfile)
    private readonly profileRepository: Repository<UserBodyProfile>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    userId: string,
    dto: CreateUserBodyProfileDto,
  ): Promise<UserBodyProfile> {
    // ensure user exists
    await this.usersService.findOne(userId);

    // One-to-Many: each entry is a new history record, no duplicate check
    const profile = this.profileRepository.create({ ...dto, userId });
    return this.profileRepository.save(profile);
  }

  /**
   * Find body profile entries for a user with pagination support.
   * Returns { items, total, page, limit } shape so the interceptor
   * can build accurate pagination metadata (totalItems = actual DB count).
   */
  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedBodyProfile> {
    // ensure user exists
    await this.usersService.findOne(userId);

    const [items, total] = await this.profileRepository.findAndCount({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  /**
   * Update a specific body profile entry by its own id.
   * Use GET /users/:userId/body-profile to find the id of the entry to update.
   */
  async update(
    userId: string,
    profileId: string,
    dto: UpdateUserBodyProfileDto,
  ): Promise<UserBodyProfile> {
    // ensure user exists
    await this.usersService.findOne(userId);

    const profile = await this.profileRepository.findOne({
      where: { id: profileId, userId },
    });
    if (!profile) {
      throw new NotFoundException(
        `Body profile ${profileId} not found for user ${userId}`,
      );
    }

    await this.profileRepository.update(profile.id, dto);
    return this.profileRepository.findOne({
      where: { id: profile.id },
      relations: ['user'],
    }) as Promise<UserBodyProfile>;
  }

  /**
   * Delete a specific body profile entry by its own id.
   */
  async remove(
    userId: string,
    profileId: string,
  ): Promise<{ message: string }> {
    // ensure user exists
    await this.usersService.findOne(userId);

    const profile = await this.profileRepository.findOne({
      where: { id: profileId, userId },
    });
    if (!profile) {
      throw new NotFoundException(
        `Body profile ${profileId} not found for user ${userId}`,
      );
    }

    await this.profileRepository.delete(profile.id);
    return { message: `Body profile ${profileId} deleted successfully` };
  }
}
