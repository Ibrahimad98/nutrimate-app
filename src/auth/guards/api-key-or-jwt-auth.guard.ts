import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Guard that accepts either:
 * - x-api-key header (Baileys API key)
 * - JWT Bearer token
 *
 * If x-api-key is present and valid, it bypasses JWT validation.
 * If x-api-key is absent, falls back to JWT validation.
 */
@Injectable()
export class ApiKeyOrJwtAuthGuard implements CanActivate {
  private readonly validApiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.validApiKey =
      this.configService.get<string>('BAILEYS_API_KEY') || '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 1. Check x-api-key first — if present and valid, allow immediately
    const apiKey = request.headers['x-api-key'];
    if (apiKey) {
      if (!this.validApiKey || apiKey !== this.validApiKey) {
        throw new UnauthorizedException('Invalid API key');
      }
      // Mark request as api-key authenticated (for downstream logic if needed)
      (request as any).authMethod = 'api-key';
      return true;
    }

    // 2. Fall back to JWT validation
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authentication required: provide x-api-key header or JWT bearer token',
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token);
      (request as any).user = payload;
      (request as any).authMethod = 'jwt';
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired JWT token');
    }
  }
}
