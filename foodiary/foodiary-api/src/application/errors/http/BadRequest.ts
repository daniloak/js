import { ErrorCode } from '../errorCode';
import { HttpError } from './HttpError';

export class BadRequest extends HttpError {
  public override statusCode = 400;
  public override code: ErrorCode;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message?: any, code?: ErrorCode) {
    super();

    this.name = 'BadRequest';
    this.message = message ?? 'Bad Request';
    this.code = code ?? ErrorCode.BAD_REQUEST;
  }
}
