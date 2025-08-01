import KSUID from 'ksuid';

export class Meal {
  readonly id: string;
  readonly accountId: string;

  status: Meal.Status;
  attempts: number;
  inputType: Meal.InputType;
  inputFileKey: string;
  name: string;
  icon: string;
  foods: Meal.Food[];

  readonly createdAt: Date;

  constructor(attrs: Meal.Attributes) {
    this.id = attrs.id ?? KSUID.randomSync().string;
    this.accountId = attrs.accountId;
    this.status = attrs.status;
    this.inputType = attrs.inputType;
    this.inputFileKey = attrs.inputFileKey;
    this.attempts = attrs.attempts ?? 0;
    this.name = attrs.name ?? '';
    this.icon = attrs.icon ?? '';
    this.foods = attrs.foods ?? [];
    this.createdAt = attrs.createdAt ?? new Date();
  }
}

export namespace Meal {
  export type Attributes = {
    readonly accountId: string;

    status: Meal.Status;
    inputType: Meal.InputType;
    inputFileKey: string;
    id?: string;
    attempts?: number;
    name?: string;
    icon?: string;
    foods?: Meal.Food[];
    createdAt?: Date;
  };

  export enum Status {
    UPLOADING = 'UPLOADING',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }

  export enum InputType {
    AUDIO = 'AUDIO',
    PICTURE = 'PICTURE',
  }

  export type Food = {
    name: string;
    quantity: string;
    calorires: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  }
}
