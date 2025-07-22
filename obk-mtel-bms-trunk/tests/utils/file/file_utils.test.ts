import fs from 'fs';
import { readAndParseJsonFile } from '../../../src/utils/file/file_utils';

jest.mock('fs');

describe('readAndParseJsonFile', () => {
  it('should not throw error if file is exist on s3', async () => {
    // Assign the mock to the getObject method
    jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('{"test": ""}'));

    readAndParseJsonFile('test');
  });
});
