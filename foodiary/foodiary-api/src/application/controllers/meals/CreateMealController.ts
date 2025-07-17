import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateMealController extends Controller<'private', CreateMealController.Response> {
  constructor() {
    super();
  }

  protected override async handle({
    accountId,
  }: Controller.Request<'private'>): Promise<Controller.Response<CreateMealController.Response>> {

    return {
      statusCode: 200,
      body: {
        accountId,
      },
    };
  }
}

export namespace CreateMealController {
  export type Response = {
    accountId: string;
  }
}
