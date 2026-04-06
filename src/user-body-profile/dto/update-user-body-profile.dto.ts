import { IsNumber, IsDateString, IsEnum, Min, Max, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, ActivityLevel } from '../entities/user-body-profile.entity';

export class UpdateUserBodyProfileDto {
  @ApiPropertyOptional({
    example: 172.0,
    description: 'Height in centimeters',
    minimum: 50,
    maximum: 300,
  })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(300)
  heightCm?: number;

  @ApiPropertyOptional({
    example: 70.0,
    description: 'Weight in kilograms',
    minimum: 10,
    maximum: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(500)
  weightKg?: number;

  @ApiPropertyOptional({
    example: '1995-04-01',
    description: 'Date of birth in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    enum: Gender,
    example: Gender.FEMALE,
    description: 'Biological gender',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    enum: ActivityLevel,
    example: ActivityLevel.ACTIVE,
    description: 'Physical activity level',
  })
  @IsOptional()
  @IsEnum(ActivityLevel)
  activityLevel?: ActivityLevel;
}
