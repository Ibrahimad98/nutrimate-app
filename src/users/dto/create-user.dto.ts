import { IsEmail, IsString, MinLength, IsOptional, IsEnum, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'admin@example.com', description: 'User email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '6281234567890', description: 'User phone number without + prefix (e.g. 6281234567890)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/^\+/, '') : value))
  @Matches(/^[1-9]\d{1,14}$/, { message: 'phone must be digits only without + prefix (e.g. 6281234567890)' })
  phone?: string;

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
