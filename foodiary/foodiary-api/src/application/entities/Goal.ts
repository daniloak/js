export class Goal {
  readonly accountId: string;

  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;

  readonly createdAt: Date;

  constructor(attrs: Goal.Attributes) {
    this.accountId = attrs.accountId;
    this.calories = attrs.calories;
    this.proteins = attrs.proteins;
    this.carbohydrates = attrs.carbohydrates;
    this.fats = attrs.fats;

    this.createdAt = attrs.createdAt ?? new Date();
  }
}

export namespace Goal {
  export type Attributes = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt?: Date;
  };
}
