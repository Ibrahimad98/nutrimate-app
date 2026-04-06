import { IsNumber, IsDateString, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, ActivityLevel } from '../entities/user-body-profile.entity';

export class CreateUserBodyProfileDto {
  @ApiProperty({
    example: 170.5,
    description: 'Height in centimeters (used for BMI & calorie calculation)',
    minimum: 50,
    maximum: 300,
  })
  @IsNumber()
  @Min(50)
  @Max(300)
  heightCm: number;

  @ApiProperty({
    example: 65.0,
    description: 'Weight in kilograms (used for BMI & calorie calculation)',
    minimum: 10,
    maximum: 500,
  })
  @IsNumber()
  @Min(10)
  @Max(500)
  weightKg: number;

  @ApiProperty({
    example: '1995-04-01',
    description: 'Date of birth in YYYY-MM-DD format (used to calculate age → nutritional needs)',
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: 'Biological gender (calorie & nutrition needs differ between male and female)',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    enum: ActivityLevel,
    example: ActivityLevel.MODERATE,
    description: 'Physical activity level — determines TDEE (Total Daily Energy Expenditure)',
  })
  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;
}
