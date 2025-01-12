"use server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import sharp from "sharp";

interface SignedURLResponse {
  success: boolean;
  signedUrl?: string;
  fileUrl?: string;
  error?: string;
}

const bucketName = process.env.NEXT_AWS_S3_BUCKET_NAME;
const region = process.env.NEXT_AWS_S3_REGION;

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION ?? "",
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY ?? "",
  },
});

export async function getSignedURL(
  fileType: string = "webp",
  contentType: string = "image/webp",
  expiresIn: number = 60
): Promise<SignedURLResponse> {
  try {
    if (!bucketName || !region) {
      throw new Error("Missing required environment variables");
    }

    const name = `${nanoid()}.${fileType}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: name,
      ContentType: contentType,
      Metadata: {
        "x-amz-meta-uploaded": new Date().toISOString(),
      },
    });

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn,
    });

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${name}`;

    return {
      success: true,
      signedUrl,
      fileUrl,
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const processThumbnail = async (file: File): Promise<Buffer> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  return sharp(buffer)
    .resize(1080, 1920, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();
};

export const uploadThumbnail = async (file: File) => {
  const { signedUrl, fileUrl } = await getSignedURL();

  if (!signedUrl || !fileUrl) {
    throw new Error("Error generating signed URL");
  }

  const processedThumbnail = await processThumbnail(file);

  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    body: processedThumbnail,
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": processedThumbnail.length.toString(),
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload thumbnail: ${uploadResponse.statusText}`);
  }

  return fileUrl;
};

export const deleteThumbnail = async (url: string) => {
  const fileName = url.split("/").pop();

  const data = await s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    })
  );
  console.log("delete thumbnail", data);
  return data;
};
