import { Profile } from '@application/entities/Profile';
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { ProfileItem } from '../items/ProfileItem';

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) { }

  public async findByAccountId(accountId: string): Promise<Profile | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: ProfileItem.getPK(accountId),
        SK: ProfileItem.getSK(accountId),
      },
    });

    const { Item: profileItem } = await dynamoClient.send(command);

    if (!profileItem) {
      return null;
    }

    return ProfileItem.toEntity(profileItem as ProfileItem.ItemType);
  }

  public async save(profile: Profile) {
    const profileItem = ProfileItem.fromEntity(profile).toItem();

    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: profileItem.PK,
        SK: profileItem.SK,
      },
      UpdateExpression: 'SET #name = :name, #birthDate = :birthDate, #gender = :gender, #height = :height, #weight = :weight',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#birthDate': 'birthDate',
        '#gender': 'gender',
        '#height': 'height',
        '#weight': 'weight',
      },
      ExpressionAttributeValues: {
        ':name': profileItem.name,
        ':birthDate': profileItem.birthDate,
        ':gender': profileItem.gender,
        ':height': profileItem.height,
        ':weight': profileItem.weight,
      },
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }

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
