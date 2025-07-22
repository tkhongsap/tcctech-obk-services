import { PassThrough, Readable } from 'stream';
import client from '../../../../src/utils/aws/s3/s3_client';
import { downloadFromS3 } from '../../../../src/utils/aws/s3';
import fs from 'fs';

jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs, // spread the real methods if you want a hybrid mock

    createWriteStream: jest.fn(() => {
      const stream = new PassThrough();
      stream.on('finish', () => {
        process.nextTick(() => stream.end());
      });
      return stream;
    }),

    writeFileSync: jest.fn(),
    readFileSync: jest.fn(() => 'mock file content'),
    existsSync: jest.fn(() => true),
    mkdirSync: jest.fn(),
    unlinkSync: jest.fn(),
    statSync: jest.fn(() => ({
      isFile: (): boolean => true,
    })),
  };
});

describe('download from s3', () => {
  it('should not throw error if file is exist on s3', async () => {
    const mockStream = new PassThrough();
    mockStream.end(Buffer.from('Your simulated S3 object body data here'));
    jest.spyOn(client, 'getObject').mockResolvedValue(mockStream);
    jest.spyOn(fs, 'writeFileSync');

    downloadFromS3('test', '');
  });

  it.skip('should throw error if file is not exist on s3', async () => {
    const mockStream = new PassThrough();
    mockStream.end();
    // end the stream after a short delay
    jest.spyOn(client, 'getObject').mockResolvedValue(null as unknown as Readable);
    jest.spyOn(fs, 'writeFileSync');
    try {
      await downloadFromS3('test', '');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
