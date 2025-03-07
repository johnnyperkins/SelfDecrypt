import { Encrypter, Decrypter } from 'age-encryption'
import { bufferToBase64 } from '../utils/encoding'

export enum EncryptionError {
  EncryptionFailed = 'EncryptionFailed',
  DecryptionFailed = 'DecryptionFailed',
  InvalidPassword = 'InvalidPassword',
  FileAccessError = 'FileAccessError',
}

export type EncryptionResultSuccess<T> = { success: true; value: T }
export type EncryptionResultFailure = { success: false; error: EncryptionError }

export type Result<T> = EncryptionResultSuccess<T> | EncryptionResultFailure

export const encryptFile = async (
  fileBuffer: ArrayBuffer,
  password: string,
): Promise<Result<Uint8Array>> => {
  try {
    const encrypter = new Encrypter()
    encrypter.setPassphrase(password)
    const encryptedBytes = await encrypter.encrypt(new Uint8Array(fileBuffer))
    return { success: true, value: encryptedBytes }
  } catch (error) {
    return { success: false, error: EncryptionError.EncryptionFailed }
  }
}

export const decryptFile = async (
  ciphertext: Uint8Array,
  password: string,
): Promise<Result<Uint8Array>> => {
  try {
    const decrypter = new Decrypter()
    decrypter.addPassphrase(password)
    const decryptedBytes = await decrypter.decrypt(ciphertext)
    return { success: true, value: decryptedBytes }
  } catch (error) {
    return { success: false, error: EncryptionError.DecryptionFailed }
  }
}

export const encryptFileToBase64 = async (
  file: File,
  password: string,
): Promise<Result<string>> => {
  const fileBuffer = await file.arrayBuffer()
  const encryptResult = await encryptFile(fileBuffer, password)
  if (!encryptResult.success) {
    return encryptResult
  }
  const base64Ciphertext = bufferToBase64(encryptResult.value.buffer)
  return { success: true, value: base64Ciphertext }
}
