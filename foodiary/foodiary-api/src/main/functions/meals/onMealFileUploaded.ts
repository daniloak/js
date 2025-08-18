import 'reflect-metadata';

import { MealFileUploadedFileEventHandler } from '@application/events/files/MealFileUploadedFileEventHandler';
import { lambdaS3Adapter } from '@main/adapters/lambdaS3Adapter';

export const handler = lambdaS3Adapter(MealFileUploadedFileEventHandler);
