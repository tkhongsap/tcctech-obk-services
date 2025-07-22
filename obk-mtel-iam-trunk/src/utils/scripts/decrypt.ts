async function decryptWithPrivateKey(privateKey: CryptoKey, encryptedData: ArrayBuffer): Promise<object> {
  const decryptedData = await crypto.subtle.decrypt({ name: 'RSA-OAEP' } as RsaOaepParams, privateKey, encryptedData);
  return JSON.parse(new TextDecoder().decode(decryptedData));
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

function arrayBufferToOutput(
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

async function exportKey(key: CryptoKey): Promise<string> {
  const exportedKey = await crypto.subtle.exportKey(key.type === 'private' ? 'pkcs8' : 'spki', key);
  const pem = arrayBufferToOutput(exportedKey, key.type, 'pem');

  return pem;
}

async function importKeyFromPem(pem: string): Promise<CryptoKey> {
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

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

(async () => {
  const data =
    'NjKDAtrdR+LDmnkJAkH7RLNcvCOR/zBFDwfHbKJX/ZZN8bKxA4PEnXw4QIQR0Biqw75GNxEXRyc/kehPxD6uAsaeub79ok4W4AywT8AbLorbjfiGradsfjYEWRpCXL9AugyUUELc2IlZu/nmtzQmDq064lpWlQeNvsUIF340zo1WsKB98NVUMON+psr/7XiaT4FYAN2uudmd2C9+JskEnikeGtiZt+zzop8FkCHNDTdigluo4eXW0e2QbY8OpkbMuvLuxY2eZqoReHxzwXh+TLbxjCXzhE947WI74xGo/0R/PY28p0shNR2AUlnzRnUuTkDn6bjS8KZENZ4oYBWlvQ==';
  const privateKey =
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgCW5xu/xiRbgiMfv8ZMUsII4Ib+SOixyoihzMY3kTrMFGbDAmI80iG166FmfmlW1F9b1gBZbdf2FSPb+YkYiEV5/MAMUyUTysSKMQBUVbratsW4VJ24QliBVPcC2oFY2LZKNcUYjIx8fumaVQRztNcE7isiCLFnv7yPvss/X25Z9hUXWPKn5lYo2SD1h6OirK1q9H7My5vYs6mzjBLgwn/jyUzW58y26EsN4J7YHUHBR6A/sXsebqk8b0DmGo+abnUJZwl4uMO/2y1fKDK7DsUogEYgC5kXk89mAGQPqEXQ4DibCumKtl/0mLltKQHJf/X2HbaL61UwfSMP0IC8dNAgMBAAECggEADFZ9zcXk4LyoQ/afiydHri26VXsu3zBpXrL7ImS+1l34rpGzqpUTAQCkLmuAyh2WBZE67taveVcTLTB2f3Ak2rMYrjUW/tiVeWDGNXt6i+VZNGrf3UBPsUcLAYtP8cfrmCYDlB/zECuaxdHRlV1QfJlec4qxCJgMqe4mQerj2QtepSwp3gjzjf3cDZ8D3IdbR9xjbPWfH+ghMJI5PewDILBgEUwTZMETC5IfwdShfVBzKaAP3+E4ZnQAAe5FUQabur0x/vg8T8NaCXogIDQs2PBK9Y2ZFQ/af28jNhqD5EvV/QRHrvoOAxjzYm+V1OWcQcHMtvoGN15vLMU+R0+NYQKBgQDO4yGqF1aCr91i2J2oq6AR6veBwEniFIbAsAMZ328tjjCz5UVpxYdy6ZxEWUVgYOPAgq9CDcQRreaS644g0X4PutiIn1Jtrhev1oE4uiVVtcTFf2Ds0EZtaDWD+ktDePyDXkUK6v+a0DLardzcC8tUNXWXBY2Dr9l0sZsGchzC0QKBgQDGByBqQGGSBL5x3Pv152sPxMF/SlNjkCYKX3RvO979kvZo9XIlQNspMxnnZEfLayq5jTiGrYF9mRMfuAawMedStCLk/vxxzKC0RPO98tyAf7yOkTzVdHS+MXGOia5S9ZqKwR84FIcnerfp19M7lAcHRcSt8My0U3H/ZPdlMO+DvQKBgDwzP1J9JAE3J1Zh7c5s0lEkbAznZRhSHLvo+54FtBYvb+CI8F/MyJMZgw0oZNWcm+kindi8pLb4QUWzIVJPYz00g1mN8rBTnjTeWA+nqsF7+Nv3Kr7+A+BGGHxk0o25oNChF7oLk4D64DFdsgydqfbA74yYYwtUmhQoshF4FwJhAoGAT0HO8XevFXgcmQnvNi5XJUqEf2PKGFE7SG+H9HUr/KVzRfLmqo5YqRawyXHTYlEUGouxEgYji5dWlh1bX+25PdqnFKwRcaKKt1vZii7Hng6B8zWh+XTQvMahQoFMahuurNY6noFozp5JOaiN/Ix0e66q10tHQu0a9TL96Vw6oKkCgYEAxW5N7UI7DWwf9xwtoATWLY9fmcsopY8Ki1F2kcLHA6ZH5fvDAef13jJkyok9RZtNDecbCusR72XSGCfhV16uPJ6pQqHqM06eAxQmMUf1y9fP7cQgcUScCs2jlKZTKdLL47mFw8cP41ATBnTjFRsABIUv4J32tr3s4doMmy2xQMg=\n-----END PRIVATE KEY-----';

  const privateKeyPem = await exportKey(await importKeyFromPem(privateKey));
  const importedPrivateKey = await importKeyFromPem(privateKeyPem);

  const payload = base64ToArrayBuffer(data);

  const decryptedPayload = await decryptWithPrivateKey(importedPrivateKey, payload);
  console.log({ decryptedPayload });
})();
