import { IQueueConsumer } from '@application/contracts/IQueueConsumer';
import { SQSHandler } from 'aws-lambda';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lambdaSQSAdapter(consumer: IQueueConsumer<any>): SQSHandler {
  return async (event) => {
    await Promise.allSettled(
      event.Records.map(async record => {
        const message = JSON.parse(record.body);

        await consumer.process(message);
      }),
    );
  };
}
