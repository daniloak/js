import { Account } from '@application/entities/Account';
import { Goal } from '@application/entities/Goal';
import { Profile } from '@application/entities/Profile';
import { EmailAlreadyExists } from '@application/errors/application/EmailAlreadyExists';
import { GoalCalculator } from '@application/services/GoalCalculator';
import { AccountRepository } from '@infra/database/dynamo/repositories/AccountRepository';
import { SignUpUnitOfWork } from '@infra/database/dynamo/uow/SignUpUnitOfWork';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';
import { Saga } from '@shared/saga/Saga';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signUpUow: SignUpUnitOfWork,
    private readonly saga: Saga,
  ) { }

  public async execute({ account: { email, password }, profile: profileInfo }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    return this.saga.run(async () => {
      const emailAlreadyExists = await this.accountRepository.findByEmail(email);

      if (emailAlreadyExists) {
        throw new EmailAlreadyExists();
      }

      const account = new Account({ email });
      const profile = new Profile({
        ...profileInfo,
        accountId: account.id,
      });

      const { calories, carbohydrates, fats, proteins } = GoalCalculator.calculate(profile);
      const goal = new Goal({
        accountId: account.id,
        calories,
        proteins,
        carbohydrates,
        fats,
      });

      const { externalId } = await this.authGateway.signUp({ email, password, internalId: account.id });
      this.saga.addCompensation(() => this.authGateway.deleteUser({ externalId }));
      account.externalId = externalId;

      await this.signUpUow.run({ account, goal, profile });

      const { accessToken, refreshToken } = await this.authGateway.signIn({ email, password });

      return {
        accessToken,
        refreshToken,
      };
    });
  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
    },
    profile: {
      name: string;
      birthDate: Date;
      gender: Profile.Gender;
      height: number;
      weight: number;
      activityLevel: Profile.ActivityLevel;
      goal: Profile.Goal;
    }
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
