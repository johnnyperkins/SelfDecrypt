export const createDownloadLink = (
  fileContent: string,
  fileName: string,
  downloadLink: HTMLAnchorElement,
  downloadLinkContainer: HTMLDivElement,
): void => {
  const blob = new Blob([fileContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  downloadLink.href = url
  downloadLink.download = fileName
  downloadLinkContainer.style.display = 'block'
}

export const initiateDownload = (data: Uint8Array, filename: string): void => {
  const blob = new Blob([data])
  const url = URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')

  downloadLink.href = url
  downloadLink.download = filename
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

export const getEncryptPageElements = () => {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  const passwordInput = document.getElementById(
    'passwordInput',
  ) as HTMLInputElement
  const encryptButton = document.getElementById(
    'encryptButton',
  ) as HTMLButtonElement
  const downloadLinkContainer = document.getElementById(
    'downloadLinkContainer',
  ) as HTMLDivElement
  const downloadLink = document.getElementById(
    'downloadLink',
  ) as HTMLAnchorElement

  return {
    fileInput,
    passwordInput,
    encryptButton,
    downloadLinkContainer,
    downloadLink,
  }
}

export const getDecryptPageElements = () => {
  const decryptPasswordInput = document.getElementById(
    'decryptPassword',
  ) as HTMLInputElement
  const decryptButton = document.getElementById(
    'decryptButton',
  ) as HTMLButtonElement

  return { decryptPasswordInput, decryptButton }
}

export const ENCRYPT_BUTTON_DEFAULT_TEXT = 'Encrypt File'
export const ENCRYPT_BUTTON_LOADING_TEXT = 'Encrypting...'
export const DECRYPT_BUTTON_DEFAULT_TEXT = 'Decrypt File'
export const DECRYPT_BUTTON_LOADING_TEXT = 'Decrypting...'

export const setEncryptButtonLoading = (
  encryptButton: HTMLButtonElement,
  loading: boolean,
) => {
  encryptButton.textContent = loading
    ? ENCRYPT_BUTTON_LOADING_TEXT
    : ENCRYPT_BUTTON_DEFAULT_TEXT
  encryptButton.disabled = loading
}

export const setDecryptButtonLoading = (
  decryptButton: HTMLButtonElement,
  loading: boolean,
) => {
  decryptButton.textContent = loading
    ? DECRYPT_BUTTON_LOADING_TEXT
    : DECRYPT_BUTTON_DEFAULT_TEXT
  decryptButton.disabled = loading
}
