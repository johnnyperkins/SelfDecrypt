import { Encrypter, Decrypter } from 'age-encryption'

export enum EncryptionError {
  EncryptionFailed = 'EncryptionFailed',
  DecryptionFailed = 'DecryptionFailed',
  InvalidPassword = 'InvalidPassword',
  FileAccessError = 'FileAccessError',
}

export type EncryptionResultSuccess = {
  success: true
  value: Uint8Array<ArrayBufferLike>
}
export type EncryptionResultFailure = { success: false; error: EncryptionError }

export type Result = EncryptionResultSuccess | EncryptionResultFailure

export const encryptFile = async (
  file: File,
  password: string,
): Promise<Result> => {
  try {
    const encrypter = new Encrypter()
    encrypter.setPassphrase(password)

    const fileBuffer = await file.arrayBuffer()
    const encryptedBytes = await encrypter.encrypt(new Uint8Array(fileBuffer))
    return { success: true, value: encryptedBytes }
  } catch (error) {
    return { success: false, error: EncryptionError.EncryptionFailed }
  }
}

export const decryptFile = async (
  ciphertext: Uint8Array,
  password: string,
): Promise<Result> => {
  try {
    const decrypter = new Decrypter()
    decrypter.addPassphrase(password)
    const decryptedBytes = await decrypter.decrypt(ciphertext)
    return { success: true, value: decryptedBytes }
  } catch (error) {
    return { success: false, error: EncryptionError.DecryptionFailed }
  }
}
