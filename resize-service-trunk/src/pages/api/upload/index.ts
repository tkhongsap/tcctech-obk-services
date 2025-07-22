import { config as env } from "dotenv";
import { split } from "lodash";
import sharp from "sharp";
import storageClient from "@/utils/storage";
import { NextApiRequest, NextApiResponse } from "next";

env();

const MAX_FILE_SIZE = (Number(process.env.MAX_FILE_SIZE) || 10) * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
]);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
  },
}

class FileUploader {
  private validateFile(fileBuffer: Buffer, contentType: string) {
    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      throw new Error("Invalid file type. Only image uploads are allowed.");
    }
    if (fileBuffer.length > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the limit of 10 MB.");
    }
  }

  private generateUniqueFileName(fileName: string) {
    const file = split(fileName, ".");
    const currentTime = new Date();
    const randomString = Math.random().toString(36).substring(7); // Random string
    return `${currentTime.getTime()}_${randomString}.${file[1]}`;
  }

  private async compressImage(fileBuffer: Buffer) {
    const desiredSize = (Number(process.env.DESIREDSIZE) || 1) * 1024 * 1024; // 1MB in bytes
    const maxWidth = 1920; // Maximum width for the image
    const startingQuality = 80; // Starting quality
    const minQuality = 20; // Minimum allowed quality
    let compressedImageBuffer = fileBuffer;
    let metadata = await sharp(compressedImageBuffer).metadata();
    let width = metadata.width || maxWidth;
    while (compressedImageBuffer.length > desiredSize && width > 0) {
      let quality = Math.max(
        startingQuality - Math.floor(compressedImageBuffer.length / 100000) * 5,
        minQuality
      );
      width = Math.max(width - 100, 0); // make sure the width doesn't go negative
      compressedImageBuffer = await sharp(compressedImageBuffer)
        .resize(width)
        .jpeg({ quality })
        .toBuffer();
      metadata = await sharp(compressedImageBuffer).metadata();
      width = metadata.width || maxWidth;
    }
    return compressedImageBuffer;
  }

  private async uploadFile(
    bucketName: string,
    filePath: string,
    fileContent: Buffer
  ) {
    await storageClient.putObject({
      Bucket: bucketName,
      Key: filePath,
      Body: fileContent,
    });
  }

  public async handleUpload(req: NextApiRequest, res: NextApiResponse<any>) {
    const { bucket, fileContentBase64, fileName, contentType } = req.body;
    const DEFAULT_BUCKET_NAME = bucket ?? process.env.BUCKET_NAME;
    if (!DEFAULT_BUCKET_NAME) {
      throw new Error('Missing bucket name');
    }
    try {
      const fileBuffer = Buffer.from(fileContentBase64, "base64");
      this.validateFile(fileBuffer, contentType);
      const uniqueFileName = this.generateUniqueFileName(fileName);
      const compressedImageBuffer = await this.compressImage(fileBuffer);
      await this.uploadFile(
        DEFAULT_BUCKET_NAME,
        uniqueFileName,
        compressedImageBuffer
      );
      const imageUrl = `${process.env.CDN_URL}/${DEFAULT_BUCKET_NAME}/${uniqueFileName}`;
      return res.status(200).json({
        message: "File uploaded successfully",
        filename: uniqueFileName,
        imageUrl,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error:", error);
      return res.status(400).json({
        message: "Error processing request",
        error: errorMessage,
      });
    }
  }
}

const fileUploader = new FileUploader();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method !== "POST" && req.method !== "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  
  await fileUploader.handleUpload(req, res);
}
