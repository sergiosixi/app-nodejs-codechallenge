import {
  CallHandler,
  ExecutionContext,
  HttpException,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorResponseDto } from 'src/shared/domain/dto/error-response.dto';
import { log } from 'util';

export class ErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(error: any): Observable<any> {
    const statusCode: number = error.statusCode || error.status;
    const code: string = error.code || '500';
    const errorResponse: ErrorResponseDto = {
      code,
      message: error.message,
    };
    if (!statusCode) error = new InternalServerErrorException(error.message);
    return throwError(() => new HttpException(errorResponse, statusCode));
  }
}
