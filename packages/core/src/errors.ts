/**
 * Standard error codes
 */
export enum ErrorCode {
  // Auth
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Not found
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  // Conflict
  CONFLICT = 'CONFLICT',
  DUPLICATE = 'DUPLICATE',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // External
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * Standard application error
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: unknown,
  traceId?: string
): {
  error: {
    code: string;
    message: string;
    details?: unknown;
    traceId?: string;
  };
  statusCode: number;
} {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        traceId,
      },
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: error.message,
        traceId,
      },
      statusCode: 500,
    };
  }

  return {
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: 'Unknown error',
      traceId,
    },
    statusCode: 500,
  };
}

/**
 * Common error constructors
 */
export const Errors = {
  unauthorized: (message = 'Unauthorized') =>
    new AppError(ErrorCode.UNAUTHORIZED, message, undefined, 401),
  forbidden: (message = 'Forbidden') =>
    new AppError(ErrorCode.FORBIDDEN, message, undefined, 403),
  notFound: (message = 'Resource not found') =>
    new AppError(ErrorCode.NOT_FOUND, message, undefined, 404),
  validation: (message: string, details?: unknown) =>
    new AppError(ErrorCode.VALIDATION_ERROR, message, details, 400),
  conflict: (message: string) => new AppError(ErrorCode.CONFLICT, message, undefined, 409),
  internal: (message = 'Internal server error') =>
    new AppError(ErrorCode.INTERNAL_ERROR, message, undefined, 500),
};
