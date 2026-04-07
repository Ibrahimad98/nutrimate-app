import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsEnum, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'newemail@example.com', description: 'User email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+6281234567890', description: 'User phone number in E.164 format' })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'phone must be in E.164 format (e.g. +6281234567890)' })
  phone?: string;

  @ApiPropertyOptional({ example: 'newpassword123', description: 'User password (min 6 chars)', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'John Updated', description: 'User full name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.ADMIN, description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true, description: 'Whether user account is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
