import { encryptWithPublicKey, decryptWithPrivateKey, hashPassword, comparePassword, generateKeyPair, exportKey, importKeyFromPem } from "../../src/utils/encrypt";

let string: string
let hashedString: string

describe("compare hash", () => {
  beforeEach(async () => {
    string = "supersecuredpassword"
    hashedString = await hashPassword(string) as string
  })

  it("return true", async () => {
    const compareResult = await comparePassword(string, hashedString)

    expect(compareResult).toBeTruthy()
  })

  describe("with incorrect plain string", () => {
    it('return false', async () => {
      const compareResult = await comparePassword('', hashedString)

      expect(compareResult).toBeFalsy()      
    })
  })
})

describe("encrypt and descrypt with private and public keys", () => {
  it("return a valid payload", async () => {
    const keyPair = await generateKeyPair()
    const payload = { data: "super-secured-data" };

    const encryptedData = await encryptWithPublicKey(keyPair.publicKey, payload);
    const decryptedPayload = await decryptWithPrivateKey(keyPair.privateKey, encryptedData);

    expect(decryptedPayload).toEqual({ data: "super-secured-data" })

    const publicKeyPem = await exportKey(keyPair.publicKey)
    const privateKeyPem = await exportKey(keyPair.privateKey)

    const importedPublicKey = await importKeyFromPem(publicKeyPem)
    const importedPrivateKey = await importKeyFromPem(privateKeyPem)

    const newlyEncryptedData = await encryptWithPublicKey(importedPublicKey, payload);
    const newlyDecryptedPayload = await decryptWithPrivateKey(importedPrivateKey, newlyEncryptedData);

    expect(newlyDecryptedPayload).toEqual({ data: "super-secured-data" })
  })
})
