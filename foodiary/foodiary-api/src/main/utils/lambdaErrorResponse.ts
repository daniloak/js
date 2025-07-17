import { ErrorCode } from '@application/errors/errorCode';

interface ILambdaErrorResponseParams {
  statusCode: number;
  code: ErrorCode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
}

export function lambdaErrorResponse({ code, message, statusCode }: ILambdaErrorResponseParams) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      error: {
        code: code,
        message: message,
      },
    }),
    headers: { 'Content-Type': 'application/json' },
  };
}
