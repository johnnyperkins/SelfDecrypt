import { encryptFile } from '../services/encryptionService'
import { createDownloadLink } from '../utils/dom'
import { bufferToBase64 } from '../utils/encoding'
import { hydrateTemplate } from '../utils/template'
import decryptScripts from '../injectedScripts/decrypt-bundle.js?raw'
import decryptTemplate from '../templates/decryptTemplate.html?raw'

export const createEncryptHandler =
  (
    fileInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
    downloadLinkContainer: HTMLDivElement,
    downloadLink: HTMLAnchorElement,
  ) =>
  async () => {
    const file = fileInput.files?.[0]
    const password = passwordInput.value

    if (!file || !password) {
      alert('Please select a file and enter a password')
      return
    }
    const encryptResult = await encryptFile(file, password)

    if (!encryptResult.success) {
      console.error('Encryption error:', encryptResult.error)
      alert('Encryption failed. See console for details')
      return
    }

    const encryptResultBase64 = bufferToBase64(encryptResult.value.buffer)

    const hydratedTemplate = hydrateTemplate(decryptTemplate, {
      REPLACE_WITH_SCRIPT_BUNDLE: decryptScripts,
      REPLACE_WITH_ORIGINAL_FILENAME: file.name,
      REPLACE_WITH_ENCRYPTED_DATA: encryptResultBase64,
    })

    createDownloadLink(
      hydratedTemplate,
      'SelfDecrypt.html',
      downloadLink,
      downloadLinkContainer,
    )
  }
