import * as crypto from 'crypto';

/**
 * Encode a password using SHA1 and salt
 * @param {string} password - The plain password
 * @param {string} salt - The base64-encoded salt
 * @returns {string} - The base64-encoded SHA1 hash
 */
export const encodePassword = (password: string, salt: string) => {
  const saltBuffer = Buffer.from(salt, 'base64');
  const passwordBuffer = Buffer.from(password, 'utf16le'); // Unicode == UTF-16LE in C#
  const combinedBuffer = Buffer.concat([saltBuffer, passwordBuffer]);

  try {
    const hash = crypto
      .createHash('sha1')
      .update(combinedBuffer)
      .digest('base64');
    return hash;
  } catch (e) {
    console.error(e);
    return '';
  }
};
