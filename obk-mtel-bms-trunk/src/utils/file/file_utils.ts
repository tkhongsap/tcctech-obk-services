import fs from 'fs';

export function readAndParseJsonFile<T>(filePath: string): T {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData) as T;
}
