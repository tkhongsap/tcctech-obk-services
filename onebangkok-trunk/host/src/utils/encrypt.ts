import crypto from 'crypto-js';

export enum HashingType {
  SHA512 = 'SHA512',
}
const generateSHA512Hash = (text: string): string => {
  const hash = crypto.SHA512(text);
  return hash.toString();
};

const hash = (hashType: string, text: string): string => {
  switch (hashType) {
    case HashingType.SHA512:
      return generateSHA512Hash(text);
    default:
      break;
  }
  return '';
};

export default hash;
