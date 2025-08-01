/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://api.foodiary.dev.danilokasparian.online/meals';
const TOKEN = 'eyJraWQiOiJ5STdhaXZJQU9mdHVlUmpcL2w4aFwvS1kwUExXaGVvOGZxSzJzVXF6cEFhSUE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NGE4NzQwOC04MGYxLTcwNTMtZTk4Yy03YjQ4Y2Q2ZGQzNTAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9jN2JYdXV0ZUgiLCJjbGllbnRfaWQiOiI3ZmNpZGg1Yjk0NjFkMm1wYnA5cnFuaDJvOSIsIm9yaWdpbl9qdGkiOiJjMTE5Y2ZkNC01YTViLTQ1ZGUtYWNlMi04OTA5N2MzOGU5MTIiLCJpbnRlcm5hbElkIjoiMzBoUktLY2NHc1lCZWdoY3N6eG0zd1JoV1ptIiwiZXZlbnRfaWQiOiJkZTBmYjk4ZC0xYzJkLTQ5ZTQtODk2NC00OWFkMGY5OTJhZWQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU0MDc3ODc1LCJleHAiOjE3NTQxMjEwNzUsImlhdCI6MTc1NDA3Nzg3NSwianRpIjoiM2ViNDk3ZmEtNGE2ZS00NDZjLTkwNjAtM2M1OTZiZjJlNzA0IiwidXNlcm5hbWUiOiI5NGE4NzQwOC04MGYxLTcwNTMtZTk4Yy03YjQ4Y2Q2ZGQzNTAifQ.hDwA302FkQN4dFbzOHCPRo_-u2CCH8eZ2K_rTho5pOIdl0ENLMxHsv7DToFODXs25JwlCk-t6M5k3c-zzWts0pN5W1s3wtBhOF2aqv8SeR1stBizPRPAvzLmSMlVH4q6KWGgw5_kdq6gDQMgTh20iZPm1aPIfzqzzcrAps4sOagUYAYTRL-w3PEdGNKXCXvicZOe9Fd39L_dTxXjUmNCkewpz0af9G2Crm0ThZm1-FFQp0TJHzpzH9W-mwviXLHXN-PNdOSqiDO3sGXOisvwW_oBALdtZPmAtFm5L4Rt4TuKiqghrtiQ2BAWifTWxCizmXsbKYTifH_A7H3sdMd_dQ';

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
  path.resolve(__dirname, 'assets', 'meal.jpg'),
).catch(() => process.exit(1));
