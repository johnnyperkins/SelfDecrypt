import { decryptFile } from '../services/encryptionService'
import { base64ToUint8Array } from '../utils/encoding'
import { initiateDownload } from '../utils/dom'

export const createDecryptHandler =
  (
    decryptPasswordInput: HTMLInputElement,
    base64Ciphertext: string,
    originalFilename: string,
  ) =>
  async () => {
    const decryptPassword = decryptPasswordInput.value
    if (!decryptPassword) {
      alert('Please enter the decryption password')
      return
    }

    const ciphertextBytes: Uint8Array = base64ToUint8Array(base64Ciphertext)
    const decryptResult = await decryptFile(ciphertextBytes, decryptPassword)

    if (decryptResult.success) {
      initiateDownload(decryptResult.value, originalFilename)
    } else {
      console.error('Decryption error:', decryptResult.error)
      alert('Decryption failed. Incorrect password or corrupted file')
    }
  }
