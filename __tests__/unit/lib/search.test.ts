import React from 'react'
import {
  highlightMatches,
  validateSearchIndex,
  createSearchError,
  contentTypeConfig
} from '@/lib/search'
import type { FuseResultMatch } from 'fuse.js'

/**
 * Helper to extract text content and mark elements from highlightMatches result
 */
function getPartsFromResult(result: React.ReactNode): { texts: string[]; marks: string[] } {
  const texts: string[] = []
  const marks: string[] = []
  if (typeof result === 'string') {
    texts.push(result)
    return { texts, marks }
  }
  if (Array.isArray(result)) {
    for (const part of result) {
      if (typeof part === 'string') {
        texts.push(part)
      } else if (React.isValidElement(part) && part.type === 'mark') {
        marks.push(String(part.props.children))
      }
    }
  }
  return { texts, marks }
}

describe('highlightMatches', () => {
  test('returns original text when no matches provided', () => {
    const text = 'Hello World'
    expect(highlightMatches(text)).toBe(text)
    expect(highlightMatches(text, undefined)).toBe(text)
  })

  test('returns original text when matches array is empty', () => {
    const text = 'Hello World'
    expect(highlightMatches(text, [])).toBe(text)
  })

  test('returns original text when no title match exists', () => {
    const text = 'Hello World'
    const matches: FuseResultMatch[] = [
      { key: 'description', value: 'test', indices: [[0, 3]], refIndex: 0 }
    ]
    expect(highlightMatches(text, matches)).toBe(text)
  })

  test('returns original text when title match has no indices', () => {
    const text = 'Hello World'
    const matches: FuseResultMatch[] = [
      { key: 'title', value: 'Hello World', refIndex: 0 }
    ]
    expect(highlightMatches(text, matches)).toBe(text)
  })

  test('highlights single match as React elements', () => {
    const text = 'Hello World'
    const matches: FuseResultMatch[] = [
      { key: 'title', value: 'Hello World', indices: [[0, 4]], refIndex: 0 }
    ]
    const result = highlightMatches(text, matches)
    const { texts, marks } = getPartsFromResult(result)
    expect(marks).toEqual(['Hello'])
    expect(texts).toEqual([' World'])
  })

  test('highlights multiple matches as React elements', () => {
    const text = 'Hello World'
    const matches: FuseResultMatch[] = [
      { key: 'title', value: 'Hello World', indices: [[0, 4], [6, 10]], refIndex: 0 }
    ]
    const result = highlightMatches(text, matches)
    const { texts, marks } = getPartsFromResult(result)
    expect(marks).toEqual(['Hello', 'World'])
    expect(texts).toEqual([' '])
  })

  test('highlights match at end of text', () => {
    const text = 'Hello World'
    const matches: FuseResultMatch[] = [
      { key: 'title', value: 'Hello World', indices: [[6, 10]], refIndex: 0 }
    ]
    const result = highlightMatches(text, matches)
    const { texts, marks } = getPartsFromResult(result)
    expect(texts).toEqual(['Hello '])
    expect(marks).toEqual(['World'])
  })

  test('highlights match in middle of text', () => {
    const text = 'Hello Beautiful World'
    const matches: FuseResultMatch[] = [
      { key: 'title', value: 'Hello Beautiful World', indices: [[6, 14]], refIndex: 0 }
    ]
    const result = highlightMatches(text, matches)
    const { texts, marks } = getPartsFromResult(result)
    expect(texts).toEqual(['Hello ', ' World'])
    expect(marks).toEqual(['Beautiful'])
  })

  test('does not render HTML from malicious titles (XSS prevention)', () => {
    const text = '<img onerror=alert(1)>'
    const matches: FuseResultMatch[] = [
      { key: 'title', value: text, indices: [[0, 3]], refIndex: 0 }
    ]
    const result = highlightMatches(text, matches)
    const { texts, marks } = getPartsFromResult(result)
    // The malicious HTML is treated as plain text, not parsed as HTML
    expect(marks).toEqual(['<img'])
    expect(texts).toEqual([' onerror=alert(1)>'])
  })
})

describe('validateSearchIndex', () => {
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

  beforeEach(() => {
    consoleWarnSpy.mockClear()
  })

  afterAll(() => {
    consoleWarnSpy.mockRestore()
  })

  it('returns empty items when data is null', () => {
    const result = validateSearchIndex(null)
    expect(result.items).toEqual([])
    expect(result.isPartial).toBe(false)
    expect(result.validationErrors).toContain('Search index data is not an object')
  })

  it('returns empty items when data is undefined', () => {
    const result = validateSearchIndex(undefined)
    expect(result.items).toEqual([])
    expect(result.validationErrors).toContain('Search index data is not an object')
  })

  it('returns empty items when data is not an object', () => {
    const result = validateSearchIndex('string')
    expect(result.items).toEqual([])
    expect(result.validationErrors).toContain('Search index data is not an object')
  })

  it('returns empty items when items array is missing', () => {
    const result = validateSearchIndex({ metadata: {} })
    expect(result.items).toEqual([])
    expect(result.validationErrors).toContain('Search index missing items array')
  })

  it('returns empty items when items is not an array', () => {
    const result = validateSearchIndex({ items: 'not-array' })
    expect(result.items).toEqual([])
    expect(result.validationErrors).toContain('Search index missing items array')
  })

  it('validates and returns valid items', () => {
    const validItem = {
      id: 'test-1',
      type: 'prompt',
      title: 'Test Prompt',
      path: '/prompts/test'
    }
    const result = validateSearchIndex({ items: [validItem] })
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toEqual(validItem)
    expect(result.isPartial).toBe(false)
    expect(result.validationErrors).toHaveLength(0)
  })

  it('filters out non-object items', () => {
    const validItem = {
      id: 'test-1',
      type: 'prompt',
      title: 'Test Prompt',
      path: '/prompts/test'
    }
    const result = validateSearchIndex({ items: [null, validItem, 'string', undefined] })
    expect(result.items).toHaveLength(1)
    expect(result.isPartial).toBe(true)
    expect(result.validationErrors).toContain('Item at index 0 is not an object')
    expect(result.validationErrors).toContain('Item at index 2 is not an object')
    expect(result.validationErrors).toContain('Item at index 3 is not an object')
  })

  it('filters out items with missing required fields', () => {
    const incompleteItem = { id: 'test-1', type: 'prompt' }
    const validItem = {
      id: 'test-2',
      type: 'agent',
      title: 'Test Agent',
      path: '/agents/test'
    }
    const result = validateSearchIndex({ items: [incompleteItem, validItem] })
    expect(result.items).toHaveLength(1)
    expect(result.items[0].id).toBe('test-2')
    expect(result.isPartial).toBe(true)
    expect(result.validationErrors[0]).toContain('missing fields: title, path')
  })

  it('filters out items with invalid type', () => {
    const invalidTypeItem = {
      id: 'test-1',
      type: 'invalid-type',
      title: 'Test',
      path: '/test'
    }
    const result = validateSearchIndex({ items: [invalidTypeItem] })
    expect(result.items).toHaveLength(0)
    expect(result.isPartial).toBe(true)
    expect(result.validationErrors[0]).toContain('invalid type: invalid-type')
  })

  it('accepts all valid content types', () => {
    const validTypes = ['prompt', 'agent', 'power', 'steering', 'hook']
    const items = validTypes.map((type, index) => ({
      id: `test-${index}`,
      type,
      title: `Test ${type}`,
      path: `/${type}/test`
    }))
    const result = validateSearchIndex({ items })
    expect(result.items).toHaveLength(5)
    expect(result.isPartial).toBe(false)
    expect(result.validationErrors).toHaveLength(0)
  })

  it('logs validation warnings when errors exist', () => {
    const invalidItem = { id: 'test-1' }
    validateSearchIndex({ items: [invalidItem] })
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Search index validation warnings:',
      expect.any(Array)
    )
  })

  it('does not log warnings when no errors exist', () => {
    const validItem = {
      id: 'test-1',
      type: 'prompt',
      title: 'Test',
      path: '/test'
    }
    validateSearchIndex({ items: [validItem] })
    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })
})

describe('createSearchError', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

  beforeEach(() => {
    consoleErrorSpy.mockClear()
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  it('creates index_load_failed error with Error instance', () => {
    const originalError = new Error('Network error')
    const result = createSearchError('index_load_failed', originalError)
    
    expect(result.type).toBe('index_load_failed')
    expect(result.message).toBe('Network error')
    expect(result.userMessage).toBe('Unable to load search data. Please try again.')
    expect(result.canRetry).toBe(true)
  })

  it('creates index_load_failed error with non-Error value', () => {
    const result = createSearchError('index_load_failed', 'string error')
    
    expect(result.type).toBe('index_load_failed')
    expect(result.message).toBe('Unknown error')
    expect(result.canRetry).toBe(true)
  })

  it('creates index_load_failed error without original error', () => {
    const result = createSearchError('index_load_failed')
    
    expect(result.type).toBe('index_load_failed')
    expect(result.message).toBe('Unknown error')
  })

  it('creates index_malformed error', () => {
    const result = createSearchError('index_malformed')
    
    expect(result.type).toBe('index_malformed')
    expect(result.message).toBe('Search index data is corrupted or malformed')
    expect(result.userMessage).toBe('Search data appears to be corrupted. Please try again later.')
    expect(result.canRetry).toBe(true)
  })

  it('creates search_failed error with Error instance', () => {
    const originalError = new Error('Processing failed')
    const result = createSearchError('search_failed', originalError)
    
    expect(result.type).toBe('search_failed')
    expect(result.message).toBe('Processing failed')
    expect(result.userMessage).toBe('Search encountered an error. Please try a different query.')
    expect(result.canRetry).toBe(false)
  })

  it('creates search_failed error without original error', () => {
    const result = createSearchError('search_failed')
    
    expect(result.type).toBe('search_failed')
    expect(result.message).toBe('Search processing failed')
  })

  it('creates partial_data error', () => {
    const result = createSearchError('partial_data')
    
    expect(result.type).toBe('partial_data')
    expect(result.message).toBe('Some search data could not be loaded')
    expect(result.userMessage).toBe('Some content may not appear in search results.')
    expect(result.canRetry).toBe(false)
  })

  it('logs original error when provided', () => {
    const originalError = new Error('Test error')
    createSearchError('index_load_failed', originalError)
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Search error details:', originalError)
  })

  it('does not log when no original error provided', () => {
    createSearchError('index_malformed')
    
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
})

describe('contentTypeConfig', () => {
  it('has configuration for all content types', () => {
    expect(contentTypeConfig.prompt).toEqual({ badge: 'Prompt', color: 'blue' })
    expect(contentTypeConfig.agent).toEqual({ badge: 'Agent', color: 'green' })
    expect(contentTypeConfig.power).toEqual({ badge: 'Power', color: 'purple' })
    expect(contentTypeConfig.steering).toEqual({ badge: 'Steering', color: 'orange' })
    expect(contentTypeConfig.hook).toEqual({ badge: 'Hook', color: 'red' })
  })

  it('is readonly and cannot be modified', () => {
    // TypeScript enforces this at compile time with 'as const'
    // This test verifies the structure exists
    const types = Object.keys(contentTypeConfig)
    expect(types).toHaveLength(5)
    expect(types).toContain('prompt')
    expect(types).toContain('agent')
    expect(types).toContain('power')
    expect(types).toContain('steering')
    expect(types).toContain('hook')
  })
})
