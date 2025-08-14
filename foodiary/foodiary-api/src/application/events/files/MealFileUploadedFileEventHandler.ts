import { IFileEventHandler } from '@application/contracts/IFileEventHandler';
import { MealUploadedUseCase } from '@application/usecases/meals/MealUploadedUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class MealFileUploadedFileEventHandler implements IFileEventHandler {
  constructor(private readonly mealUploadedUseCase: MealUploadedUseCase) { }

  async handle({ fileKey }: IFileEventHandler.Input): Promise<void> {
    console.log(`Processing file upload for key: ${fileKey}`);
    await this.mealUploadedUseCase.execute({ fileKey });
  }
}
