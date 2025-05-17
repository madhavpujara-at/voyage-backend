export interface ValidationErrorDetail {
  path: string;
  message: string;
}

export class ValidationError extends Error {
  public readonly statusCode = 400;
  public readonly errors: ValidationErrorDetail[];

  constructor(message: string, errors: ValidationErrorDetail[]) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
} 