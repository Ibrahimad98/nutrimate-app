import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBodyProfile } from './entities/user-body-profile.entity';
import { CreateUserBodyProfileDto } from './dto/create-user-body-profile.dto';
import { UpdateUserBodyProfileDto } from './dto/update-user-body-profile.dto';
import { UsersService } from '../users/users.service';

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

    const existing = await this.profileRepository.findOne({
      where: { userId },
    });
    if (existing) {
      throw new ConflictException(
        `Body profile for user ${userId} already exists. Use PATCH to update.`,
      );
    }

    const profile = this.profileRepository.create({ ...dto, userId });
    return this.profileRepository.save(profile);
  }

  async findByUserId(userId: string): Promise<UserBodyProfile | object> {
    // ensure user exists
    await this.usersService.findOne(userId);

    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) {
      return {};
    }
    return profile;
  }

  async update(
    userId: string,
    dto: UpdateUserBodyProfileDto,
  ): Promise<UserBodyProfile> {
    const profile = await this.findByUserIdInternal(userId);
    await this.profileRepository.update(profile.id, dto);
    return this.profileRepository.findOne({
      where: { id: profile.id },
      relations: ['user'],
    }) as Promise<UserBodyProfile>;
  }

  async remove(userId: string): Promise<{ message: string }> {
    const profile = await this.findByUserIdInternal(userId);
    await this.profileRepository.delete(profile.id);
    return { message: `Body profile for user ${userId} deleted successfully` };
  }

  private async findByUserIdInternal(userId: string): Promise<UserBodyProfile> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(
        `Body profile for user ${userId} not found`,
      );
    }
    return profile;
  }
}
