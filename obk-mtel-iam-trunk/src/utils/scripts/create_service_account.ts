import AccountRepository from '../../repositories/account_repository';
import { exportKey, generateKeyPair, generateRandomHex } from '../encrypt';

// Fetching command line arguments
const args = process.argv.slice(2);
const name = args[1]; // Extracting the name from command line arguments

if (!name) {
  console.error('Error: Please provide a name for the service.');
  process.exit(1);
}

(async () => {
  const keyPair = await generateKeyPair();
  const publicKeyPem = await exportKey(keyPair.publicKey);
  const privateKeyPem = await exportKey(keyPair.privateKey);
  const apiKeySecret = generateRandomHex(32);

  try {
    const account = await AccountRepository.create({
      data: {
        api_key: {
          create: {
            secret: apiKeySecret,
            key_pairs: {
              create: {
                name: name,
                public: publicKeyPem,
                private: privateKeyPem,
              },
            },
          },
        },
        attached_permission: {
          create: [
            {
              permittee_type: 'account',
              value: {
                name: 'ob-bms:fs',
                service: 'ob-bms',
                actions: ['*'],
                resource_type: 'fs',
                resource: { id: 'self' },
              },
            },
            {
              permittee_type: 'account',
              value: {
                name: 'ob-iam:token',
                service: 'ob-iam',
                actions: ['read'],
                resource_type: 'token',
                resource: { account_id: 'self' },
              },
            },
          ],
        },
      },
      include: {
        api_key: {
          include: {
            key_pairs: true,
          },
        },
      },
    });

    console.dir({ account }, { depth: null });
    console.log(`
name: ${account.api_key[0].key_pairs[0].name}
api_key_id: ${account.api_key[0].id}
api_key_secret: ${account.api_key[0].secret}

${account.api_key[0].key_pairs[0].public}

${account.api_key[0].key_pairs[0].private}
    `);
  } catch (error) {
    console.error('Error creating account:', error);
  }
})();
