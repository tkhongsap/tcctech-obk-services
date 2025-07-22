import bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const saltRounds = 10; // The number of salt rounds determines the hashing complexity

// Function to hash a password using bcrypt
export async function hashPassword(plainPassword: string | null): Promise<string | null> {
  try {
    if (plainPassword) {
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      return hashedPassword;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

// Function to compare a plain password with a hashed password
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}

export async function encryptWithPublicKey(publicKey: CryptoKey, data: object): Promise<ArrayBuffer> {
  const dataString = JSON.stringify(data);
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' } as RsaOaepParams,
    publicKey,
    new TextEncoder().encode(dataString),
  );

  return encryptedData;
}

export async function decryptWithPrivateKey(privateKey: CryptoKey, encryptedData: ArrayBuffer): Promise<object> {
  const decryptedData = await crypto.subtle.decrypt({ name: 'RSA-OAEP' } as RsaOaepParams, privateKey, encryptedData);
  return JSON.parse(new TextDecoder().decode(decryptedData));
}

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt'],
  );
}

export function arrayBufferToOutput(
  buf: ArrayBuffer,
  type: 'raw' | 'private' | 'public' | 'secret' = 'raw',
  outputFormat: 'pem' | 'string' = 'string',
): string {
  const binary = Array.prototype.map.call(new Uint8Array(buf), (byte) => String.fromCharCode(byte)).join('');
  const base64 = btoa(binary);

  if (outputFormat === 'string') {
    return base64;
  }

  let header, footer;
  if (type === 'private') {
    header = '-----BEGIN PRIVATE KEY-----';
    footer = '-----END PRIVATE KEY-----';
  } else {
    header = '-----BEGIN PUBLIC KEY-----';
    footer = '-----END PUBLIC KEY-----';
  }

  return `${header}\n${base64}\n${footer}`;
}

function pemToUint8Array(pem: string): Uint8Array {
  const binaryString = atob(pem);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function importKeyFromPem(pem: string): Promise<CryptoKey> {
  const headerPublic = '-----BEGIN PUBLIC KEY-----';
  const footerPublic = '-----END PUBLIC KEY-----';
  const headerPrivate = '-----BEGIN PRIVATE KEY-----';
  const footerPrivate = '-----END PRIVATE KEY-----';

  const isPublicKey = pem.includes(headerPublic) && pem.includes(footerPublic);
  const isPrivateKey = pem.includes(headerPrivate) && pem.includes(footerPrivate);

  if (!isPublicKey && !isPrivateKey) {
    throw new Error('PEM format is neither public nor private key.');
  }

  const base64Key = pem
    .replace(headerPublic, '')
    .replace(footerPublic, '')
    .replace(headerPrivate, '')
    .replace(footerPrivate, '')
    .replace(/\n/g, '');

  const keyBuffer = pemToUint8Array(base64Key);

  return await crypto.subtle.importKey(
    isPrivateKey ? 'pkcs8' : 'spki',
    keyBuffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    isPrivateKey ? ['decrypt'] : ['encrypt'],
  );
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const exportedKey = await crypto.subtle.exportKey(key.type === 'private' ? 'pkcs8' : 'spki', key);
  const pem = arrayBufferToOutput(exportedKey, key.type, 'pem');

  return pem;
}

export function sanitizeKey(key: string): string {
  return key.replace(/\\n/g, '\n');
}

export function generateRandomHex(length: number): string {
  const bytes = Math.ceil(length / 2);
  const buffer: Buffer = (crypto as any).randomBytes(bytes);
  const hexString: string = buffer.toString('hex').slice(0, length);

  return hexString;
}
