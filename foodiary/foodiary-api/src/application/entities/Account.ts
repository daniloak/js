import KSUID from 'ksuid';

export class Account {
  readonly id: string;
  readonly email: string;
  externalId: string | undefined;
  readonly createdAt: Date;

  constructor(attrs: Account.Attributes) {
    this.id = attrs.id ?? KSUID.randomSync().string;
    this.email = attrs.email;
    this.externalId = attrs.externalId;
    this.createdAt = attrs.createdAt ?? new Date();
  }
}

export namespace Account {
  export type Attributes = {
    id?: string;
    email: string;
    externalId?: string;
    createdAt?: Date;
  };
}
