import { decryptFile } from '../services/encryptionService'
import { base64ToUint8Array } from '../utils/encoding'
import { initiateDownload, setDecryptButtonLoading } from '../utils/dom'
import { delay } from '../utils/async'

export const createDecryptHandler =
  (
    decryptPasswordInput: HTMLInputElement,
    decryptButton: HTMLButtonElement,
    base64Ciphertext: string,
    originalFilename: string,
  ) =>
  async () => {
    const decryptPassword = decryptPasswordInput.value
    if (!decryptPassword) {
      alert('Please enter the decryption password')
      return
    }

    setDecryptButtonLoading(decryptButton, true)
    await delay()

    const ciphertextBytes: Uint8Array = base64ToUint8Array(base64Ciphertext)
    const decryptResult = await decryptFile(ciphertextBytes, decryptPassword)

    setDecryptButtonLoading(decryptButton, false)

    if (decryptResult.success) {
      initiateDownload(decryptResult.value, originalFilename)
      decryptPasswordInput.value = ''
    } else {
      console.error('Decryption error:', decryptResult.error)
      alert('Decryption failed. Incorrect password or corrupted file')
    }
  }
