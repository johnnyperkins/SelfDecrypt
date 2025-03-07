import { describe, it, expect } from 'vitest'
import { encryptFile, decryptFile, EncryptionError } from './encryptionService'
import type {
  EncryptionResultSuccess,
  EncryptionResultFailure,
} from './encryptionService'

const createMockFile = (content: string): File => {
  const blob = new Blob([content], { type: 'text/plain' })
  return Object.assign(blob, {
    name: 'secrets.txt',
    lastModified: Date.now(),
  }) as File
}

describe('encryption utils', () => {
  describe('encryptFile & decryptFile', () => {
    it('encrypts and decrypts a file', async () => {
      const fileContent = 'plain text oh no!'
      const file = createMockFile(fileContent)
      const password = 'theywillneverguessthis'

      // encrypt
      const encryptedResult = (await encryptFile(
        file,
        password,
      )) as EncryptionResultSuccess
      expect(encryptedResult.success).toBe(true)
      expect(encryptedResult.value).toBeInstanceOf(Uint8Array)

      // decrypt
      const decryptedResult = (await decryptFile(
        encryptedResult.value,
        password,
      )) as EncryptionResultSuccess
      expect(decryptedResult.success).toBe(true)
      expect(new TextDecoder().decode(decryptedResult.value)).toEqual(
        fileContent,
      )
    })
  })

  describe('encryptFile', () => {
    it('returns EncryptionFailed on error', async () => {
      const data = Symbol('Boom!')
      const password = 'whoCares?'
      const result = (await encryptFile(
        // @ts-expect-error testing invalid data to cause failure
        data,
        password,
      )) as EncryptionResultFailure

      expect(result.success).toBe(false)
      expect(result.error).toBe(EncryptionError.EncryptionFailed)
    })
  })

  describe('decryptFile', () => {
    it('returns a DecryptionFailed error result if decryption fails due to incorrect password', async () => {
      const file = createMockFile('wow')
      const password = 'guess_me'
      const wrongPassword = 'is-it-this'

      // encrypt
      const encryptResult = (await encryptFile(
        file,
        password,
      )) as EncryptionResultSuccess
      expect(encryptResult.success).toBe(true)

      // attempt decrypt
      const ciphertext = encryptResult.value
      const decryptResult = (await decryptFile(
        ciphertext,
        wrongPassword,
      )) as EncryptionResultFailure

      expect(decryptResult.success).toBe(false)
      expect(decryptResult.error).toBe(EncryptionError.DecryptionFailed)
    })

    it('returns a DecryptionFailed error result if decryption fails for invalid ciphertext', async () => {
      const invalidCiphertext = new Uint8Array([1, 2, 3]) // invalid age-encrypted data
      const password = 'blah'

      const decryptResult = (await decryptFile(
        invalidCiphertext,
        password,
      )) as EncryptionResultFailure

      expect(decryptResult.success).toBe(false)
      expect(decryptResult.error).toBe(EncryptionError.DecryptionFailed)
    })
  })
})
