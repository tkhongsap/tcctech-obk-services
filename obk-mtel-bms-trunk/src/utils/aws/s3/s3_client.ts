import * as Minio from 'minio';

const useMinio = process.env.USE_MINIO === 'true';

let config;

if (useMinio) {
  config = {
    endPoint: process.env.MINIO_ENDPOINT || '',
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
  };
  console.log('Connecting to MinIO...');
} else {
  config = {
    endPoint: process.env.AWS_ENDPOINT || 's3.amazonaws.com',
    accessKey: process.env.AWS_ACCESS_KEY_ID || '',
    secretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  };
  console.log('Connecting to AWS S3...');
}

const s3Client = new Minio.Client(config);

export default s3Client;
