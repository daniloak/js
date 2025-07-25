import { Account } from '@application/entities/Account';
import { EmailAlreadyExists } from '@application/errors/application/EmailAlreadyExists';
import { AccountRepository } from '@infra/database/dynamo/repositories/AccountRepository';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
  ) { }

  public async execute({ email, password }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const emailAlreadyExists = await this.accountRepository.findEmail(email);

    if (emailAlreadyExists) {
      throw new EmailAlreadyExists();
    }

    const account = new Account({ email });

    const { externalId } = await this.authGateway.signUp({ email, password, internalId: account.id });
    account.externalId = externalId;

    await this.accountRepository.create(account);

    const { accessToken, refreshToken } = await this.authGateway.signIn({ email, password });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
