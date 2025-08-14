import 'reflect-metadata';

import { MealFileUploadedFileEventHandler } from '@application/events/files/MealFileUploadedFileEventHandler';
import { Registry } from '@kernel/di/Registry';
import { lambdaS3Adapter } from '@main/adapters/lambdaS3Adapter';

const eventHandler = Registry.getInstance().resolve(MealFileUploadedFileEventHandler);

export const handler = lambdaS3Adapter(eventHandler);
