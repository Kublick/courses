"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION ?? "",
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY ?? "",
  },
});

export async function getSignedURL() {
  try {
    // Generate unique file name
    const name = `${nanoid()}`;

    // Create a PutObjectCommand
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME || "",
      Key: name,
      ContentType: `application/octet-stream`,
    });

    // Generate a pre-signed URL
    const url = await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 });

    // Construct the public file URL
    const fileUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME || ""}.s3.${process.env.NEXT_AWS_S3_REGION || ""}.amazonaws.com/${name}`;

    return {
      success: true,
      signedUrl: url,
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
