import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class InternalService {
  constructor(private readonly usersService: UsersService) {}

  async getRegisteredPhones(): Promise<string[]> {
    const phones = await this.usersService.findAllPhones();
    // Strip + prefix for consistency with Baileys & OTP flow
    return phones.map((p) => p.replace(/^\+/, ''));
  }

  async getUserByPhone(phone: string) {
    // Normalize: strip + prefix before lookup so both +628... and 628... work
    const normalizedPhone = phone.replace(/^\+/, '');
    const user = await this.usersService.findByPhone(normalizedPhone);
    if (!user) {
      throw new NotFoundException(`User with phone ${normalizedPhone} not found`);
    }
    const { password, ...result } = user;
    return result;
  }
}
