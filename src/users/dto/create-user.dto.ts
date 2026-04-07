import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+6281234567890', description: 'User phone number' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 6 chars)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Jane Doe', description: 'User full name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER, description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
