import {
  ExceptionFilter,
  Catch,
  BadRequestException,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestExceptionFilter.name, {
    timestamp: true,
  });

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const { method, url, query, body } = request;
    const status = exception.getStatus() || HttpStatus.BAD_REQUEST;
    const message = exception.message || 'Bad request';

    this.logger.warn(
      `[BAD REQUEST]: "METHOD":${method} "URL":${url} "QUERY":${JSON.stringify(
        query,
      )} "BODY":${JSON.stringify(body)}`,
    );
    return response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
