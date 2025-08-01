import { Meal } from '@application/entities/Meal';

export class MealItem {
  public static readonly type = 'Meal';
  private readonly keys: MealItem.Keys;

  constructor(private readonly attrs: MealItem.Attributes) {
    this.keys = {
      PK: MealItem.getPK({ accountId: attrs.accountId, mealId: attrs.id }),
      SK: MealItem.getSK({ accountId: attrs.accountId, mealId: attrs.id }),
      GSI1PK: MealItem.getGSI1PK({
        accountId: attrs.accountId,
        createdAt: new Date(attrs.createdAt),
      }),
      GSI1SK: MealItem.getGSI1SK(attrs.id),
    };
  }

  toItem(): MealItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: MealItem.type,
    };
  }

  static fromEntity(meal: Meal) {
    return new MealItem({
      ...meal,
      createdAt: meal.createdAt.toISOString(),
    });
  }

  static toEntity(mealItem: MealItem.ItemType) {
    return new Meal({
      id: mealItem.id,
      accountId: mealItem.accountId,
      attempts: mealItem.attempts,
      name: mealItem.name,
      icon: mealItem.icon,
      status: mealItem.status,
      inputType: mealItem.inputType,
      inputFileKey: mealItem.inputFileKey,
      foods: mealItem.foods,
      createdAt: new Date(mealItem.createdAt),
    });
  }

  static getPK({ accountId, mealId }: MealItem.PKParams): MealItem.Keys['PK'] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }

  static getSK({ accountId, mealId }: MealItem.SKParams): MealItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }

  static getGSI1PK({ accountId, createdAt }: MealItem.GS1PKParams): MealItem.Keys['GSI1PK'] {
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');

    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK(mealId: string): MealItem.Keys['GSI1SK'] {
    return `MEALS#${mealId}`;
  }
}

export namespace MealItem {
  export type Keys = {
    PK: `ACCOUNT#${string}#MEAL#${string}`;
    SK: `ACCOUNT#${string}#MEAL#${string}`;
    GSI1PK: `MEALS#${string}#${string}-${string}-${string}`;
    GSI1SK: `MEALS#${string}`;
  }

  export type Attributes = {
    accountId: string;
    id: string;
    status: Meal.Status;
    attempts: number;
    inputType: Meal.InputType;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    createdAt: string;
  };

  export type ItemType = Keys & Attributes & {
    type: 'Meal';
  }

  export type GS1PKParams = {
    accountId: string;
    createdAt: Date;
  }

  export type PKParams = {
    accountId: string;
    mealId: string;
  }
  export type SKParams = {
    accountId: string;
    mealId: string;
  }
}
