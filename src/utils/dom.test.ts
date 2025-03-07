// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initiateDownload, createDownloadLink } from './dom'

describe('DOM Utils', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('initiateDownload', () => {
    it('creates and triggers a download link', async () => {
      const urlCreateSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:test-url')
      const urlRevokeSpy = vi.spyOn(URL, 'revokeObjectURL')
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click')
      const data = new Uint8Array([3, 6, 9])
      const filename = 'test.txt'

      initiateDownload(data, filename)

      const blobArg = urlCreateSpy.mock.calls[0][0] as Blob
      const blobBuffer = await blobArg.arrayBuffer()
      const blobData = new Uint8Array(blobBuffer)
      expect(blobData).toEqual(data)
      expect(urlRevokeSpy).toHaveBeenCalledWith('blob:test-url')
      expect(clickSpy).toHaveBeenCalled()
      expect(document.body.children.length).toBe(0)
    })
  })

  describe('createDownloadLink', () => {
    it('creates a download link and displays the container', () => {
      const fileContent = 'Neat content'
      const fileName = 'to_download.html'
      const downloadLink = document.createElement('a') as HTMLAnchorElement
      const downloadLinkContainer = document.createElement('div')
      downloadLinkContainer.style.display = 'none'
      const createObjectURLMock = vi
        .spyOn(URL, 'createObjectURL')
        .mockImplementation(() => 'mocked-url')

      createDownloadLink(
        fileContent,
        fileName,
        downloadLink,
        downloadLinkContainer,
      )

      expect(downloadLink.href.includes('mocked-url')).toBe(true)
      expect(downloadLink.download).toBe(fileName)
      expect(downloadLinkContainer.style.display).toBe('block')

      createObjectURLMock.mockRestore()
    })
  })
})
