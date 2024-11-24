import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name, {
    timestamp: true,
  });

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const { method, url, query, body } = request;
    const status = exception.getStatus() || HttpStatus.FORBIDDEN;
    const exceptionResponse = exception.getResponse();

    const message =
      exceptionResponse['error'] || exception?.message || 'HTTP_EXCEPTION';

    this.logger.warn(
      `[FORBIDDEN]: "METHOD":${method} "URL":${url} "QUERY":${JSON.stringify(
        query,
      )} "BODY":${JSON.stringify(body)}`,
    );

    return response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
