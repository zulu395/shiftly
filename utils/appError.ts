export class AppError {
  message: string;
  errorCode?: string;
  description?: string;

  constructor(
    message: string,
    {
      errorCode,
      description,
    }: { errorCode?: string; description?: string } = {}
  ) {
    this.message = message;
    this.errorCode = errorCode;
    this.description = description;
  }
}
