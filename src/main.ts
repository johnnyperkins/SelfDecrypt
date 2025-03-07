import { createEncryptHandler } from './ui/encryptUiHandler'
import encryptTemplate from './templates/encryptTemplate.html?raw'
import { getEncryptPageElements } from './utils/dom'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = encryptTemplate

document.addEventListener('DOMContentLoaded', () => {
  const {
    fileInput,
    passwordInput,
    encryptButton,
    downloadLinkContainer,
    downloadLink,
  } = getEncryptPageElements()

  encryptButton.addEventListener(
    'click',
    createEncryptHandler(
      fileInput,
      passwordInput,
      downloadLinkContainer,
      downloadLink,
    ),
  )
})
