import { Goal } from '@application/entities/Goal';
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { GoalItem } from '../items/GoalItem';

@Injectable()
export class GoalRepository {
  constructor(private readonly config: AppConfig) { }

  public getPutCommandInput(goal: Goal): PutCommandInput {
    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: GoalItem.fromEntity(goal).toItem(),
    };
  }

  public async create(goal: Goal): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(goal));

    await dynamoClient.send(command);
  }
}
