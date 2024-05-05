export class EnvironmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentValidationError';
    Object.setPrototypeOf(this, EnvironmentValidationError.prototype);
  }
}
