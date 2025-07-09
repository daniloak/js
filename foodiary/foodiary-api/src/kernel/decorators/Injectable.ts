import { Registry } from '@kernel/di/Registry';
import { Constructor } from '@shared/types/Contructor';

export function Injectable(): ClassDecorator {
  return (target) => {
    console.log(`Registering ${target.name} as injectable`);
    Registry.getInstance().register(target as unknown as Constructor);
  };
}
