import { IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '6281234567890', description: 'User phone number without + prefix (e.g. 6281234567890)' })
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/^\+/, '') : value))
  @Matches(/^[1-9]\d{1,14}$/, { message: 'phone must be digits only without + prefix (e.g. 6281234567890)' })
  phone: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 6 chars)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  name: string;
}
