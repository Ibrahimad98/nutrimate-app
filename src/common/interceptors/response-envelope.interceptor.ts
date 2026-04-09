import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  status: string;
  code: number;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, ResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseEnvelope<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode: number = response.statusCode ?? 200;

        // If data is already wrapped (has status + code), pass through
        if (
          data &&
          typeof data === 'object' &&
          'status' in data &&
          'code' in data
        ) {
          return data;
        }

        // Arrays → wrap with pagination
        if (Array.isArray(data)) {
          return {
            status: 'success',
            code: statusCode,
            data,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: data.length,
            },
          };
        }

        // Null / empty object → wrap with empty array + pagination
        if (data === null || data === undefined || (typeof data === 'object' && Object.keys(data).length === 0)) {
          return {
            status: 'success',
            code: 200,
            data: [],
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: 0,
            },
          };
        }

        // Single object
        return {
          status: 'success',
          code: statusCode,
          data,
        };
      }),
    );
  }
}
