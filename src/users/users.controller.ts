import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiKeyOrJwtAuthGuard } from '../auth/guards/api-key-or-jwt-auth.guard';

const userExample = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'user',
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('X-API-Key')
@Controller('users')
@UseGuards(ApiKeyOrJwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Create user manually (requires JWT auth)
   */
  @Post()
  @ApiOperation({ summary: 'Create a user manually (admin use)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully', schema: { example: userExample } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized – authentication required' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Get all users (paginated)
   */
  @Get()
  @ApiOperation({ summary: 'Get all users (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users',
    schema: {
      example: {
        items: [userExample],
        total: 100,
        page: 1,
        limit: 10,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized – authentication required' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findPaginated(page, limit);
  }

  /**
   * GET /users/:id
   * Get single user by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User found', schema: { example: userExample } })
  @ApiResponse({ status: 401, description: 'Unauthorized – authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Update user
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', description: 'User UUID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully', schema: { example: userExample } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized – authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Soft delete user (can be restored)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User soft-deleted successfully', schema: { example: { message: 'User uuid soft-deleted successfully' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized – authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
