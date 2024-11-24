import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP', { timestamp: true });

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, body, query } = request;

    this.logger.log(
      `[CLIENT REQUEST]: "METHOD":${method} "URL":${url} "QUERY":${JSON.stringify(
        query,
      )} "BODY":${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `[SERVER RESPONSE]: "METHOD": ${method} "URL": ${url} "STATUS": ${response?.statusCode}`,
        );
      }),
    );
  }
}
