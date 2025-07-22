process.env.AWS_S3_BUCKET_NAME = 'bucket-ob-bms-test';
process.env.USE_MINIO = 'true';
process.env.MINIO_ENDPOINT = 'localhost';
process.env.MINIO_ACCESS_KEY = 'minio';
process.env.MINIO_SECRET_KEY = 'minio123';

jest.mock('minio', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      getObject: jest.fn(),
      statObject: jest.fn(),
      // add more mocked methods as needed
    })),
  };
});
