import { Meal } from '@application/entities/Meal';
import { Injectable } from '@kernel/decorators/Injectable';
import OpenAI from 'openai';
import { MealsFileStorageGateway } from './MealsFileStorageGateway';

@Injectable()
export class MealsAIGateway {
  private readonly client = new OpenAI();

  constructor(
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) { }

  async processMeal(meal: Meal): Promise<MealsAIGateway.ProcessMealResult> {
    if (meal.inputType === Meal.InputType.PICTURE) {
      const imageUrl = await this.mealsFileStorageGateway.getFileUrl(meal.inputFileKey);
      const response = await this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            'role': 'user',
            'content': [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high',
                },
              },
              {
                type: 'text',
                text: 'O que tem nessa imagem?',
              },
            ],
          },
        ],
      });

      console.log('AI Response:', JSON.stringify(response, null, 2));
    }

    return {
      name: '',
      icon: '',
      foods: [],
    };
  }
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  }
}
