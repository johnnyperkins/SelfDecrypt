import { describe, it, expect } from 'vitest'
import { hydrateTemplate } from './template'

describe('hydrateTemplate', () => {
  it('does basic replacement', () => {
    const template = '<b>so cool</b>'
    const replacements = { cool: 'what' }
    const expected = '<b>so what</b>'
    expect(hydrateTemplate(template, replacements)).toBe(expected)
  })

  it('does multiple replacements', () => {
    const template = 'meet me at place at time'
    const replacements = { place: 'the disco', time: '11:11' }
    const expected = 'meet me at the disco at 11:11'
    expect(hydrateTemplate(template, replacements)).toBe(expected)
  })

  it('returns the original template if no replacements are provided', () => {
    const template = 'UNCHANGED!'
    const replacements = {}
    const expected = template
    expect(hydrateTemplate(template, replacements)).toBe(expected)
  })

  it('handles an empty template', () => {
    const template = ''
    const replacements = { place: 'here' }
    const expected = template
    expect(hydrateTemplate(template, replacements)).toBe(expected)
  })

  it('handles an empty replacements object', () => {
    const template = '/_ yum _/'
    const replacements = {}
    const expected = template
    expect(hydrateTemplate(template, replacements)).toBe(expected)
  })

  it('handles a placeholder not found in the template', () => {
    const template = '<a>okay</a>'
    const replacements = { place: 'globe' }
    const expected = template
    expect(hydrateTemplate(template, replacements)).toBe(expected)
  })
})
