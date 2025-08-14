import { Profile } from '@application/entities/Profile';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { ProfileRepository } from '@infra/database/dynamo/repositories/ProfileRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {

  }

  public async execute({ accountId, name, birthDate, gender, height, weight }: UpdateProfileUseCase.Input): Promise<UpdateProfileUseCase.Output> {
    const profile = await this.profileRepository.findByAccountId(accountId);

    if (!profile) {
      throw new ResourceNotFound('Profile with accountId not found');
    }

    profile.name = name;
    profile.birthDate = birthDate;
    profile.gender = gender;
    profile.weight = weight;
    profile.height = height;

    await this.profileRepository.save(profile);
  }
}

export namespace UpdateProfileUseCase {
  export type Input = {
    accountId: string;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
  }

  export type Output = void
}
