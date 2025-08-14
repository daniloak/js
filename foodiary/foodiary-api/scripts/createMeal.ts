/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://api.foodiary.dev.danilokasparian.online/meals';
const TOKEN = 'eyJraWQiOiJ5STdhaXZJQU9mdHVlUmpcL2w4aFwvS1kwUExXaGVvOGZxSzJzVXF6cEFhSUE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NGE4NzQwOC04MGYxLTcwNTMtZTk4Yy03YjQ4Y2Q2ZGQzNTAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9jN2JYdXV0ZUgiLCJjbGllbnRfaWQiOiI3ZmNpZGg1Yjk0NjFkMm1wYnA5cnFuaDJvOSIsIm9yaWdpbl9qdGkiOiIxYzkyNWU3ZS0wZTdmLTRjYzAtOWRlMy0zOTJlMDg2MzNkOWIiLCJpbnRlcm5hbElkIjoiMzBoUktLY2NHc1lCZWdoY3N6eG0zd1JoV1ptIiwiZXZlbnRfaWQiOiJmMmMxYTE2ZC1lNjM2LTQyNGUtODE4YS04ODg3NThiMGZjMzEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU1MjEyMjIzLCJleHAiOjE3NTUyNTU0MjMsImlhdCI6MTc1NTIxMjIyMywianRpIjoiNmRiMjZmZDAtNjA4OS00MGUxLTgxNmEtNTY3ZDA3NmRiMTgxIiwidXNlcm5hbWUiOiI5NGE4NzQwOC04MGYxLTcwNTMtZTk4Yy03YjQ4Y2Q2ZGQzNTAifQ.pHOoobIcAN5IIVRPQnhImGXBjoreeDrfvXXAixQPCajSby0pA8eUIpLvcJAOwTJuwMj6xk3OL1e8z9uH4UuNBOLde4bBfI8iM4BQrQ-Fm0UArQtC7EJjcOBoWDlsaAeHl7nVerLx-LOqfiKRErlNsq77g-UPwf2fHQU_KwgExHhkqAp-jTY9ME-75LiwX2SVPRA0ZAeO1FRPcHYRTqe4FYRdy5ZgzGSh6Qr2QTtpzDzUfj0xTOpjEXSW_ScvqnNDiaF9wHG_5AueNkf8GMIusw1ezz4MnVcGBrYjc67TzVCqhofD9bO8Xb72YK9fOo6S7UWIDM5tqoQQOuJkBRMcvQ';

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readImageFile(filePath: string): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type: 'image/jpeg',
  };
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignDecoded;

  console.log('✅ Received presigned POST data');
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([fileData], { type: fileType });
  form.append('file', blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
  }

  console.log('🎉 Upload completed successfully');
}

async function uploadMealImage(filePath: string): Promise<void> {
  try {
    const { data, size, type } = await readImageFile(filePath);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadMealImage:', err);
    throw err;
  }
}

uploadMealImage(
  path.resolve(__dirname, 'assets', 'meal-ia.png'),
).catch(() => process.exit(1));
