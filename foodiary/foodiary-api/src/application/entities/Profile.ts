
export class Profile {
  readonly accountId: string;

  name: string;
  birthDate: Date;
  gender: Profile.Gender;
  height: number;
  weight: number;
  readonly goal: Profile.Goal;
  readonly activityLevel: Profile.ActivityLevel;

  readonly createdAt: Date;

  constructor(attrs: Profile.Attributes) {
    this.accountId = attrs.accountId;
    this.name = attrs.name;
    this.birthDate = attrs.birthDate;
    this.gender = attrs.gender;
    this.height = attrs.height;
    this.weight = attrs.weight;
    this.goal = attrs.goal;
    this.activityLevel = attrs.activityLevel;

    this.createdAt = attrs.createdAt ?? new Date();
  }
}

export namespace Profile {
  export type Attributes = {
    accountId: string;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activityLevel: Profile.ActivityLevel;
    goal: Profile.Goal;
    createdAt?: Date;
  };

  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
  }

  export enum Goal {
    LOSE = 'LOSE',
    MAINTAIN = 'MAINTAIN',
    GAIN = 'GAIN',
  }

  export enum ActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHT = 'LIGHT',
    MODERATE = 'MODERATE',
    HEAVY = 'HEAVY',
    ATHLETE = 'ATHLETE',
  }
}
