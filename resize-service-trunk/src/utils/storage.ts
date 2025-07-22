import { Client as MinioClient } from "minio";
import { Readable } from "stream";

export interface StorageClient {
  putObject(params: { Bucket: string; Key: string; Body: Buffer }): Promise<void>
  getObject(params: { Bucket: string; Key: string }): Promise<string>
  getObjectPreview(params: { Bucket: string; Key: string }): Promise<Readable>;
  // Add other methods and properties as needed
}

let storageClient: StorageClient;
let config;
if (process.env.STORAGE_TYPE === "s3") {
  config = {
    accessKey: process.env.ACCESS_KEY_ID!,
    secretKey: process.env.SECRET_ACCESS_KEY!,
    region: process.env.REGION,
    endPoint: process.env.ENDPOINT || "s3.amazonaws.com",
  };
} else if (process.env.STORAGE_TYPE === "minio") {
  config = {
    endPoint: process.env.MINIO_ENDPOINT || "",
    port: parseInt(process.env.DRIVER_PORT || "9000"),
    // useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  };
} else {
  throw new Error("Unsupported storage type");
}
console.log(`${process.env.STORAGE_TYPE}`, config)
const minioClient = new MinioClient(config);
storageClient = {
  async putObject(params: { Bucket: string; Key: string; Body: Buffer }) {
    await minioClient.putObject(params.Bucket, params.Key, params.Body);
  },
  async getObject(params: { Bucket: string; Key: string }) {
    const stream = await minioClient.presignedGetObject(params.Bucket, params.Key, 7 * 24 * 60 * 60);
    return stream;
  },
  async getObjectPreview(params :{ Bucket: string; Key: string }) {
    const stream = await minioClient.getObject(params.Bucket, params.Key);
    return stream;
  },

  // Add other methods and properties as needed
};

export default storageClient;
