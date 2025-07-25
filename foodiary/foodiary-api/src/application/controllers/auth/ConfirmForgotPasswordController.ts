import { Controller } from '@application/contracts/Controller';
import { BadRequest } from '@application/errors/http/BadRequest';
import { ConfirmForgotPasswordUseCase } from '@application/usecases/auth/ConfirmForgotPasswordUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/schema';
import { ConfirmForgotPasswordBody, confirmForgotPasswordSchema } from './schemas/confirmForgotPasswordSchema';

@Injectable()
@Schema(confirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<'public', ConfirmForgotPasswordController.Response> {
  constructor(private readonly confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public', ConfirmForgotPasswordBody>,
  ): Promise<Controller.Response<ConfirmForgotPasswordController.Response>> {
    try {
      const { email, confirmationCode, password } = body;
      await this.confirmForgotPasswordUseCase.execute({ email, confirmationCode, password });

      return {
        statusCode: 204,
      };
    } catch {
      throw new BadRequest('Failed to confirm forgot password.');
    }
  }
}

export namespace ConfirmForgotPasswordController {
  export type Response = null
}
