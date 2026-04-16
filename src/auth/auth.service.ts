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
      phone: registerDto.phone,
      password: registerDto.password,
      name: registerDto.name,
      role: UserRole.USER,
    });

    const accessToken = this.generateAccessToken(user.id, user.phone, user.role);
    const refreshToken = this.generateRefreshToken();

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      message: 'Registration successful',
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByPhone(loginDto.phone);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const { password, ...userWithoutPassword } = user;
    const accessToken = this.generateAccessToken(
      user.id,
      user.phone,
      user.role,
    );
    const refreshToken = this.generateRefreshToken();

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const user = await this.usersService.findByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.generateAccessToken(
        payload.sub,
        payload.phone,
        payload.role,
      );

      return { access_token: accessToken };
    } catch {
      throw new UnauthorizedException('Expired or invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    const user = await this.usersService.findByRefreshToken(refreshToken);

    if (user) {
      await this.usersService.setRefreshToken(user.id, null);
    }

    return { message: 'Logged out successfully' };
  }

  private generateAccessToken(
    userId: string,
    phone: string,
    role: string,
  ): string {
    const payload = { sub: userId, phone, role };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(): string {
    const raw = crypto.randomBytes(40).toString('hex');
    return this.jwtService.sign({ raw }, { expiresIn: '30d' });
  }
}
