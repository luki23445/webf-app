import type { FastifyInstance } from 'fastify';
import { createErrorResponse, ErrorCode, AppError } from '@webf/core';
import { logger } from '@webf/core';

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const traceId = request.id;

    // Log error
    logger.error(
      {
        error,
        traceId,
        method: request.method,
        url: request.url,
      },
      'Request error'
    );

    // Handle validation errors
    if (error.validation) {
      const response = createErrorResponse(
        new AppError(
          ErrorCode.VALIDATION_ERROR,
          'Validation error',
          error.validation,
          400
        ),
        traceId
      );
      return reply.status(response.statusCode).send(response.error);
    }

    // Handle app errors
    if (error instanceof AppError) {
      const response = createErrorResponse(error, traceId);
      return reply.status(response.statusCode).send(response.error);
    }

    // Handle unknown errors
    const response = createErrorResponse(error, traceId);
    return reply.status(response.statusCode).send(response.error);
  });
}
