import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { InternalService } from './internal.service';
import { ApiKeyGuard } from './guards/api-key.guard';

@ApiTags('Internal')
@ApiSecurity('X-API-Key')
@UseGuards(ApiKeyGuard)
@Controller('internal')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Get('registered-phones')
  @ApiOperation({ summary: 'Get all registered phone numbers (without + prefix)' })
  @ApiResponse({
    status: 200,
    description: 'Array of registered phone numbers (E.164 without +)',
    schema: {
      type: 'object',
      properties: {
        phones: { type: 'array', items: { type: 'string', example: '6281234567890' } },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async getRegisteredPhones(): Promise<{ phones: string[] }> {
    const phones = await this.internalService.getRegisteredPhones();
    return { phones };
  }

  @Get('users/phone/:phone')
  @ApiOperation({ summary: 'Get user detail by phone number' })
  @ApiParam({ name: 'phone', description: 'Phone number (with or without + prefix)', example: '6281234567890' })
  @ApiResponse({ status: 200, description: 'User detail' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByPhone(@Param('phone') phone: string) {
    return this.internalService.getUserByPhone(phone);
  }
}
