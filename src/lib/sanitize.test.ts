import { describe, expect, it } from 'vitest'
import { isValidClient, isValidQuote, sanitizeClients, sanitizeQuotes } from './sanitize'

const validClient = {
  id: 'c1',
  name: 'Alice Adams',
  company: 'Adams Co',
  email: 'alice@adams.co',
  phone: '111',
  notes: '',
}

const validQuote = {
  id: 'q1',
  number: 'QF-0001',
  clientId: 'c1',
  description: 'Some work',
  issueDate: '2026-01-01',
  amount: 100,
  status: 'Draft',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('isValidClient', () => {
  it('accepts a well-formed client', () => {
    expect(isValidClient(validClient)).toBe(true)
  })

  it('rejects non-objects, arrays, and null', () => {
    expect(isValidClient(null)).toBe(false)
    expect(isValidClient('client')).toBe(false)
    expect(isValidClient(42)).toBe(false)
  })

  it('rejects a client missing required fields', () => {
    const { name: _name, ...rest } = validClient
    expect(isValidClient(rest)).toBe(false)
  })
})

describe('isValidQuote', () => {
  it('accepts a well-formed quote', () => {
    expect(isValidQuote(validQuote)).toBe(true)
  })

  it('rejects a quote with a non-numeric or missing amount', () => {
    expect(isValidQuote({ ...validQuote, amount: '100' })).toBe(false)
    expect(isValidQuote({ ...validQuote, amount: undefined })).toBe(false)
    expect(isValidQuote({ ...validQuote, amount: Number.NaN })).toBe(false)
  })

  it('rejects a quote with a zero or negative amount', () => {
    expect(isValidQuote({ ...validQuote, amount: 0 })).toBe(false)
    expect(isValidQuote({ ...validQuote, amount: -5 })).toBe(false)
  })

  it('rejects a quote with an invalid status', () => {
    expect(isValidQuote({ ...validQuote, status: 'Pending' })).toBe(false)
  })

  it('rejects a quote missing a client reference, number, or description', () => {
    expect(isValidQuote({ ...validQuote, clientId: '' })).toBe(false)
    expect(isValidQuote({ ...validQuote, number: '' })).toBe(false)
    expect(isValidQuote({ ...validQuote, description: '' })).toBe(false)
  })

  it('rejects a record from an incompatible schema', () => {
    expect(isValidQuote({ id: 'legacy-1', client: 'Some Client', total: '1200.00' })).toBe(false)
  })
})

describe('sanitizeClients / sanitizeQuotes', () => {
  it('drops invalid entries and keeps valid ones', () => {
    expect(sanitizeClients([validClient, { id: 'bad' }])).toEqual([validClient])
    expect(sanitizeQuotes([validQuote, { id: 'bad' }])).toEqual([validQuote])
  })

  it('returns an empty array for non-array input', () => {
    expect(sanitizeClients(undefined)).toEqual([])
    expect(sanitizeQuotes({ not: 'an array' })).toEqual([])
  })
})
