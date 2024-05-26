import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ResponseEntity } from '../entities/response.entity';

@Catch()
export class ValidationFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 400;
    // Check if exception has a getStatus method before calling it
    if (typeof exception.getStatus === 'function') {
      status = exception.getStatus();
    }
    let message = exception.message;
    let validation = exception?.response?.message;
    const results = exception?.response?.results;

    //convert the error message array into object key and value
    if (typeof validation !== 'string') {
      validation =
        exception?.response?.message?.reduce(
          (acc: any, errorMessage: string) => {
            const fieldName = errorMessage.split(' ')[0]; // Extract field name from the error message
            acc[fieldName] = acc[fieldName] || [];
            acc[fieldName].push(errorMessage);
            return acc;
          },
          {},
        ) || {};
    } else {
      validation = {};
    }
    const res = new ResponseEntity({
      message,
      validation,
      results,
    });
    response.status(status || 400).json(res);
  }
}
