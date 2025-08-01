import { Meal } from '@application/entities/Meal';
import { GetCommand, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { MealItem } from '../items/MealItem';

@Injectable()
export class MealRepository {
  constructor(private readonly config: AppConfig) { }

  public async findById({ mealId, accountId }: MealRepository.FindByIdParams): Promise<Meal | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: MealItem.getPK({ accountId, mealId }),
        SK: MealItem.getSK({ accountId, mealId }),
      },
    });

    const { Item: mealItem } = await dynamoClient.send(command);

    if (!mealItem) {
      return null;
    }

    return MealItem.toEntity(mealItem as MealItem.ItemType);
  }

  public getPutCommandInput(meal: Meal): PutCommandInput {
    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: MealItem.fromEntity(meal).toItem(),
    };
  }

  public async create(meal: Meal): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(meal));

    await dynamoClient.send(command);
  }
}

export namespace MealRepository {
  export type FindByIdParams = {
    accountId: string;
    mealId: string;
  }
}
