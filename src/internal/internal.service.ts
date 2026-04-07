import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class InternalService {
  constructor(private readonly usersService: UsersService) {}

  async getRegisteredPhones(): Promise<string[]> {
    return this.usersService.findAllPhones();
  }

  async getUserByPhone(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException(`User with phone ${phone} not found`);
    }
    const { password, ...result } = user;
    return result;
  }
}
