import { describe, it, expect } from 'vitest'
import { base64ToBuffer, bufferToBase64 } from './encoding'

describe('base64ToBuffer', () => {
  it('converts a valid base64 string to an ArrayBuffer', () => {
    const base64String = 'SGVsbG8gV29ybGQh' // "Hello World!" in base64
    const buffer = base64ToBuffer(base64String)
    const uint8Array = new Uint8Array(buffer)
    const textDecoder = new TextDecoder()
    const decodedString = textDecoder.decode(uint8Array)

    expect(decodedString).toBe('Hello World!')
  })

  it('handles an empty base64 string', () => {
    const base64String = ''
    const buffer = base64ToBuffer(base64String)

    expect(buffer.byteLength).toBe(0)
  })

  it('correctly converts base64 with special characters', () => {
    const base64String = 'YSArIC8gPw==' // "a + / ?" in base64
    const buffer = base64ToBuffer(base64String)
    const uint8Array = new Uint8Array(buffer)
    const textDecoder = new TextDecoder()
    const decodedString = textDecoder.decode(uint8Array)

    expect(decodedString).toBe('a + / ?')
  })
})

describe('bufferToBase64', () => {
  it('converts an ArrayBuffer to a valid base64 string', () => {
    const textEncoder = new TextEncoder()
    const buffer = textEncoder.encode('Hello World!').buffer
    const base64String = bufferToBase64(buffer)

    expect(base64String).toBe('SGVsbG8gV29ybGQh')
  })

  it('handles an empty ArrayBuffer', () => {
    const buffer = new ArrayBuffer(0)
    const base64String = bufferToBase64(buffer)

    expect(base64String).toBe('')
  })

  it('correctly converts buffer with special characters to base64', () => {
    const textEncoder = new TextEncoder()
    const buffer = textEncoder.encode('a + / ?').buffer
    const base64String = bufferToBase64(buffer)

    expect(base64String).toBe('YSArIC8gPw==')
  })
})

describe('base64ToBuffer and bufferToBase64 combination', () => {
  it('converts base64 to buffer and back to base64, resulting in the original base64 string', () => {
    const originalBase64String = 'VGhpcyBpcyBzb21lIHRlc3Qgc3RyaW5nIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzICFAIyQlXiAmICogKCkgXyArIC09W117fTpcIjtgJyw8Pi4vPw=='
    const buffer = base64ToBuffer(originalBase64String)
    const convertedBase64String = bufferToBase64(buffer)

    expect(convertedBase64String).toBe(originalBase64String)
  })

  it('converts buffer to base64 and back to buffer, resulting in the original buffer', () => {
    const textEncoder = new TextEncoder()
    const originalString = 'This is some test string with special characters !@#$%^ & *()_+ -=[]{};\':"`,<.>/?'
    const originalBuffer = textEncoder.encode(originalString).buffer
    const base64String = bufferToBase64(originalBuffer)
    const convertedBuffer = base64ToBuffer(base64String)

    expect(convertedBuffer).toEqual(originalBuffer)
  })
})