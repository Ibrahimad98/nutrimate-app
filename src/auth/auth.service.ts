import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      email: `${registerDto.phone_number}@phone.local`,
      phone_number: registerDto.phone_number,
      password: registerDto.password,
      name: registerDto.name,
      role: UserRole.USER,
    });

    const token = this.generateToken(user.id, user.phone_number, user.role);

    return {
      message: 'Registration successful',
      user,
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByPhoneNumber(loginDto.phone_number);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const { password, ...userWithoutPassword } = user;
    const token = this.generateToken(user.id, user.phone_number, user.role);

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      access_token: token,
    };
  }

  private generateToken(userId: string, phone_number: string, role: string): string {
    const payload = { sub: userId, phone_number, role };
    return this.jwtService.sign(payload);
  }
}
