import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (createUserDto.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    if (createUserDto.phone) {
      const existingPhone = await this.usersRepository.findOne({
        where: { phone: createUserDto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already in use');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    return users.map(({ password, ...rest }) => rest as Omit<User, 'password'>);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async findAllPhones(): Promise<string[]> {
    const users = await this.usersRepository.find({
      where: { isActive: true },
      select: ['phone'],
    });
    return users.map((u) => u.phone).filter(Boolean);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existing = await this.usersRepository.findOne({
        where: { phone: updateUserDto.phone },
      });
      if (existing) {
        throw new ConflictException('Phone number already in use');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(id, updateUserDto);
    const updated = await this.usersRepository.findOne({ where: { id } });
    const { password, ...result } = updated!;
    return result;
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.usersRepository.delete(id);
    return { message: `User ${id} deleted successfully` };
  }
}
