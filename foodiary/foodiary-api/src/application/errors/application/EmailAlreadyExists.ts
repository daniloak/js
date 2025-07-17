import { ErrorCode } from '../errorCode';
import { ApplicationError } from './ApplicationError';

export class EmailAlreadyExists extends ApplicationError {
  public override statusCode? = 409;
  public override code: ErrorCode;

  constructor() {
    super();

    this.name = 'EmailAlreadyExists';
    this.message = 'Email already exists';
    this.code = ErrorCode.EMAIL_ALREADY_EXISTS;
  }
}
