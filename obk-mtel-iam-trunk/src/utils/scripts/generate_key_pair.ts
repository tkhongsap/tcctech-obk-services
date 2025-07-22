import { exportKey, generateKeyPair } from '../encrypt';

(async (): Promise<void> => {
  const keyPair = await generateKeyPair();
  const publicKeyPem = await exportKey(keyPair.publicKey);
  const privateKeyPem = await exportKey(keyPair.privateKey);
  console.log({ publicKeyPem, privateKeyPem });
})();
