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
    const message =
      'The old password you provided is not matched with the user password';

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
