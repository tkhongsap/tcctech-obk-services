import s3Client from './s3_client';
import fs from 'fs';
import { finished } from 'stream/promises';

async function downloadFromS3(key: string, path: string): Promise<void> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: key,
  };

  try {
    const Body = await s3Client.getObject(params.Bucket, params.Key);
    if (Body) {
      const fileStream = fs.createWriteStream(path);
      Body.pipe(fileStream);
      await finished(fileStream);

      console.log(`File downloaded to ${path}`);
    } else {
      throw new Error('File not found in S3');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

export default downloadFromS3;
