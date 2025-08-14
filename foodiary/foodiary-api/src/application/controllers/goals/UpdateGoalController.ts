import { Controller } from '@application/contracts/Controller';
import { UpdateGoalUseCase } from '@application/usecases/goals/updateGoalUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/schema';
import { UpdateGoalBody, updateGoalSchema } from './schemas/updateGoalSchema';

@Injectable()
@Schema(updateGoalSchema)
export class UpdateGoalController extends Controller<'private', UpdateGoalController.Response> {
  constructor(private readonly updateGoalUseCase: UpdateGoalUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<'private', UpdateGoalBody>): Promise<Controller.Response<UpdateGoalController.Response>> {
    const {
      calories,
      proteins,
      carbohydrates,
      fats,
    } = body;

    await this.updateGoalUseCase.execute({
      accountId,
      calories,
      proteins,
      carbohydrates,
      fats,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace UpdateGoalController {
  export type Response = null
}
