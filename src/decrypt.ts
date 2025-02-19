import * as age from 'age-encryption'
import { base64ToBuffer } from './utils/encoding'

document.addEventListener('DOMContentLoaded', () => {
  const decryptPasswordInput = document.getElementById(
    'decryptPassword',
  ) as HTMLInputElement
  const decryptButton = document.getElementById(
    'decryptButton',
  ) as HTMLButtonElement

  decryptButton.addEventListener('click', async () => {
    const decryptPassword = decryptPasswordInput.value
    if (!decryptPassword) {
      alert('Please enter the decryption password')
      return
    }

    const base64Ciphertext = window.base64Ciphertext
    const originalFilename = window.originalFilename

    try {
      const ciphertextBytes = new Uint8Array(base64ToBuffer(base64Ciphertext))
      const decrypter = new age.Decrypter()
      decrypter.addPassphrase(decryptPassword)
      const decryptedData = await decrypter.decrypt(ciphertextBytes)

      const decryptedBlob = new Blob([decryptedData])
      const url = URL.createObjectURL(decryptedBlob)
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = originalFilename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Decryption error:', error)
      alert('Decryption failed. Incorrect password or corrupted file .')
    }
  })
})
