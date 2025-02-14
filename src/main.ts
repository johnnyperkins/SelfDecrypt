import * as age from 'age-encryption'
import decryptScripts from './injectedScripts/decrypt-bundle.js?raw'
import decryptTemplate from './templates/decryptTemplate.html?raw'
import encryptTemplate from './templates/encryptTemplate.html?raw'
import { bufferToBase64 } from './utils/encoding'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = encryptTemplate

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  const passwordInput = document.getElementById('passwordInput') as HTMLInputElement
  const encryptButton = document.getElementById('encryptButton') as HTMLButtonElement
  const downloadLinkContainer = document.getElementById('downloadLinkContainer') as HTMLDivElement
  const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement

  encryptButton.addEventListener('click', async () => {
    const file = fileInput.files?.[0]
    const password = passwordInput.value

    if (!file || !password) {
      alert('Please select a file and enter a password.')
      return
    }

    try {
      const encryptedHTML = await encryptAndWrapFile(file, password)
      const blob = new Blob([encryptedHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      downloadLink.href = url
      downloadLinkContainer.style.display = 'block'
    } catch (error) {
      console.error('Encryption error:', error)
      alert('Encryption failed. See console for details.')
    }
  })

  const encryptAndWrapFile = async (file: File, password: string): Promise<string> => {
    const fileBuffer = await file.arrayBuffer()

    const encrypter = new age.Encrypter()
    encrypter.setPassphrase(password)
    const ciphertextBytes = await encrypter.encrypt(new Uint8Array(fileBuffer))

    const base64Ciphertext = bufferToBase64(ciphertextBytes.buffer)
    const originalFilename = file.name

    const templateWithScript = decryptTemplate.replace('REPLACE_WITH_SCRIPT_BUNDLE', decryptScripts)
    const templateWithFileName = templateWithScript.replaceAll('REPLACE_WITH_ORIGINAL_FILENAME', originalFilename)
    const hydratedTemplate = templateWithFileName.replace('REPLACE_WITH_ENCRYPTED_DATA', base64Ciphertext)

    return hydratedTemplate
  }
})