import { createDecryptHandler } from './ui/decryptUiHandler'
import { getDecryptPageElements } from './utils/dom'

document.addEventListener('DOMContentLoaded', () => {
  const { decryptPasswordInput, decryptButton } = getDecryptPageElements()
  const base64Ciphertext = window.base64Ciphertext
  const originalFilename = window.originalFilename

  decryptButton.addEventListener(
    'click',
    createDecryptHandler(
      decryptPasswordInput,
      base64Ciphertext,
      originalFilename,
    ),
  )
})
