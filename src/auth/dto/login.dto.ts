import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+6281234567890', description: 'User phone number' })
  @IsString()
  phone_number: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 6 chars)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
