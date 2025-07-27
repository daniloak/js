import { Injectable } from '@kernel/decorators/Injectable';

type CompensationFn = () => Promise<void>;

@Injectable()
export class Saga {
  private compensations: (CompensationFn)[] = [];

  public addCompensation(fn: CompensationFn): void {
    this.compensations.unshift(fn);
  }

  public async run<TResult>(fn: () => Promise<TResult>) {
    try {
      return await fn();
    } catch (error) {
      await this.compensate();
      throw error;
    }
  }

  private async compensate(): Promise<void> {
    for await (const compensation of this.compensations) {
      try {
        await compensation();
      } catch { /* empty */ }
    }
  }
}
