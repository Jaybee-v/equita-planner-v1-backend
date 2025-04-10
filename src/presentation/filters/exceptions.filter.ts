import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptions } from 'src/application/exceptions/base-exceptions';

@Catch(BaseExceptions)
export class FiltersExceptions implements ExceptionFilter {
  catch(exception: BaseExceptions, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.status).json({
      statusCode: exception.status,
      message: exception.message,
    });
  }
}
