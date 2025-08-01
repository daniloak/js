import { Account } from '@application/entities/Account';
import { PutCommand, PutCommandInput, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { AccountItem } from '../items/AccountItem';

@Injectable()
export class AccountRepository {
  constructor(private readonly config: AppConfig) { }

  public getPutCommandInput(account: Account): PutCommandInput {
    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: AccountItem.fromEntity(account).toItem(),
    };
  }

  async findByEmail(email: string): Promise<Account | null> {
    const command = new QueryCommand({
      IndexName: 'GSI1',
      TableName: this.config.db.dynamodb.mainTable,
      Limit: 1,
      KeyConditionExpression: '#GSI1PK = :GSI1PK AND #GSI1SK = :GSI1SK',
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
        '#GSI1SK': 'GSI1SK',
      },
      ExpressionAttributeValues: {
        ':GSI1PK': AccountItem.getGS1PK(email),
        ':GSI1SK': AccountItem.getGS1SK(email),
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const account = Items[0] as AccountItem.ItemType | undefined;

    if (!account) {
      return null;
    }

    return AccountItem.toEntity(account);
  }

  public async create(account: Account): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(account));

    await dynamoClient.send(command);
  }
}
