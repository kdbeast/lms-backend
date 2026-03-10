import dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

dotenv.config();

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const uploadToR2 = async (file, name) => {
  const key = `${Date.now()}-${name}`;

  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: name,
  };

  await s3.send(new PutObjectCommand(params));

  return {
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
    key,
  };
};

export const getUploadUrl = async (filename, type) => {
  const key = `${Date.now()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: type,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return {
    url,
    key,
  };
};

export const getLoadUrl = async (filename) => {
  console.log("filename load", filename);
  const key = `${Date.now()}-${filename}`;
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: "application/octet-stream",
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return {
    url,
    key,
  };
};
