import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserBodyProfileService } from './user-body-profile.service';
import { CreateUserBodyProfileDto } from './dto/create-user-body-profile.dto';
import { UpdateUserBodyProfileDto } from './dto/update-user-body-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const profileExample = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  userId: 'f1e2d3c4-b5a6-7890-abcd-ef0987654321',
  heightCm: '170.50',
  weightKg: '65.00',
  dateOfBirth: '1995-04-01',
  gender: 'male',
  activityLevel: 'moderate',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

@ApiTags('User Body Profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users/:userId/body-profile')
export class UserBodyProfileController {
  constructor(private readonly service: UserBodyProfileService) {}

  /**
   * POST /users/:userId/body-profile
   * Create body profile for a user
   */
  @Post()
  @ApiOperation({ summary: 'Create body profile for a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid', description: 'User UUID' })
  @ApiBody({ type: CreateUserBodyProfileDto })
  @ApiResponse({ status: 201, description: 'Body profile created', schema: { example: profileExample } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized – JWT token required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Profile already exists for this user' })
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateUserBodyProfileDto,
  ) {
    return this.service.create(userId, dto);
  }

  /**
   * GET /users/:userId/body-profile
   * Get body profile of a user
   */
  @Get()
  @ApiOperation({ summary: 'Get body profile of a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Body profile found', schema: { example: profileExample } })
  @ApiResponse({ status: 401, description: 'Unauthorized – JWT token required' })
  @ApiResponse({ status: 404, description: 'User or body profile not found' })
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findByUserId(userId);
  }

  /**
   * PATCH /users/:userId/body-profile
   * Update body profile of a user
   */
  @Patch()
  @ApiOperation({ summary: 'Update body profile of a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid', description: 'User UUID' })
  @ApiBody({ type: UpdateUserBodyProfileDto })
  @ApiResponse({ status: 200, description: 'Body profile updated', schema: { example: profileExample } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized – JWT token required' })
  @ApiResponse({ status: 404, description: 'User or body profile not found' })
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserBodyProfileDto,
  ) {
    return this.service.update(userId, dto);
  }

  /**
   * DELETE /users/:userId/body-profile
   * Delete body profile of a user
   */
  @Delete()
  @ApiOperation({ summary: 'Delete body profile of a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Body profile deleted', schema: { example: { message: 'Body profile for user uuid deleted successfully' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized – JWT token required' })
  @ApiResponse({ status: 404, description: 'User or body profile not found' })
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.remove(userId);
  }
}
