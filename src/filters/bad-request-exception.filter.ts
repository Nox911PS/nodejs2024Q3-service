import {
  ExceptionFilter,
  Catch,
  BadRequestException,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus() || HttpStatus.BAD_REQUEST;
    const message = exception.message || 'Bad request';

    return response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
