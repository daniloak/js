import { Profile } from '@application/entities/Profile';
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { ProfileItem } from '../items/ProfileItem';

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) { }

  public getPutCommandInput(profile: Profile): PutCommandInput {
    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: ProfileItem.fromEntity(profile).toItem(),
    };
  }

  public async create(profile: Profile): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(profile));

    await dynamoClient.send(command);
  }
}
