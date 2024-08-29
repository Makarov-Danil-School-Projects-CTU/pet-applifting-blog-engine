import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
  new (...args: any[]): {};
}

// Universal serialization decorator. We provide a needed class as input parameter
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  // code before request handler

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        if (Array.isArray(data)) {
          // If data is an array, map each element to the DTO class
          return data.map((item) =>
            plainToInstance(this.dto, item, {
              excludeExtraneousValues: true,
            }),
          );
        } else {
          // If data is a single object, directly transform it
          return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }
      }),
    );
  }
}
