import { Account } from '@application/entities/Account';

export class AccountItem {
  private readonly type = 'Account';
  private readonly keys: AccountItem.Keys;

  constructor(private readonly attrs: AccountItem.Attributes) {
    this.keys = {
      PK: AccountItem.getPK(attrs.id),
      SK: AccountItem.getSK(attrs.id),
      GSI1PK: AccountItem.getGS1PK(attrs.email),
      GSI1SK: AccountItem.getGS1SK(attrs.email),
    };
  }

  toItem(): AccountItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: this.type,
    };
  }

  static fromEntity(account: Account) {
    return new AccountItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  static toEntity(account: AccountItem.ItemType) {
    return new Account({
      id: account.id,
      email: account.email,
      externalId: account.externalId,
      createdAt: new Date(account.createdAt),
    });
  }

  static getPK(accountId: string): AccountItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): AccountItem.Keys['SK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getGS1PK(email: string): AccountItem.Keys['GSI1PK'] {
    return `ACCOUNT#${email}`;
  }

  static getGS1SK(email: string): AccountItem.Keys['GSI1SK'] {
    return `ACCOUNT#${email}`;
  }
}

export namespace AccountItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ACCOUNT#${string}`;
  }

  export type Attributes = {
    id: string;
    email: string;
    externalId: string | undefined;
    createdAt: string;
  };

  export type ItemType = Keys & Attributes & {
    type: 'Account';
  }
}
