import { describe, expect, it } from 'vitest'
import type { Client, Quote } from '../types'
import {
  calculateDashboardStats,
  filterClients,
  filterQuotes,
  formatQuoteNumber,
  nextQuoteNumber,
  recentQuotes,
  validateQuoteForm,
} from './quotes'

describe('formatQuoteNumber', () => {
  it('pads sequence numbers to 4 digits with QF- prefix', () => {
    expect(formatQuoteNumber(1)).toBe('QF-0001')
    expect(formatQuoteNumber(42)).toBe('QF-0042')
    expect(formatQuoteNumber(10000)).toBe('QF-10000')
  })
})

describe('nextQuoteNumber', () => {
  it('increments from the current sequence, never reusing prior numbers', () => {
    expect(nextQuoteNumber(0)).toEqual({ number: 'QF-0001', sequence: 1 })
    expect(nextQuoteNumber(10)).toEqual({ number: 'QF-0011', sequence: 11 })
  })
})

describe('validateQuoteForm', () => {
  const validValues = {
    clientId: 'c1',
    description: 'Website redesign',
    issueDate: '2026-01-01',
    amount: '100',
    status: 'Draft' as const,
  }

  it('accepts valid input', () => {
    expect(validateQuoteForm(validValues)).toEqual({})
  })

  it('rejects a missing client', () => {
    const errors = validateQuoteForm({ ...validValues, clientId: '' })
    expect(errors.clientId).toBeDefined()
  })

  it('rejects a blank description, including whitespace-only', () => {
    expect(validateQuoteForm({ ...validValues, description: '' }).description).toBeDefined()
    expect(validateQuoteForm({ ...validValues, description: '   ' }).description).toBeDefined()
  })

  it('rejects a missing issue date', () => {
    expect(validateQuoteForm({ ...validValues, issueDate: '' }).issueDate).toBeDefined()
  })

  it('rejects zero, negative, empty, and invalid amounts', () => {
    expect(validateQuoteForm({ ...validValues, amount: '0' }).amount).toBeDefined()
    expect(validateQuoteForm({ ...validValues, amount: '-5' }).amount).toBeDefined()
    expect(validateQuoteForm({ ...validValues, amount: '' }).amount).toBeDefined()
    expect(validateQuoteForm({ ...validValues, amount: 'abc' }).amount).toBeDefined()
  })

  it('accepts a valid positive decimal amount', () => {
    expect(validateQuoteForm({ ...validValues, amount: '19.99' }).amount).toBeUndefined()
  })
})

const clients: Client[] = [
  { id: 'c1', name: 'Alice Adams', company: 'Adams Co', email: 'alice@adams.co', phone: '111', notes: '' },
  { id: 'c2', name: 'Bob Brown', company: 'Brown LLC', email: 'bob@brown.llc', phone: '222', notes: '' },
]

function makeQuote(overrides: Partial<Quote>): Quote {
  return {
    id: overrides.id ?? 'q1',
    number: overrides.number ?? 'QF-0001',
    clientId: overrides.clientId ?? 'c1',
    description: overrides.description ?? 'Some work',
    issueDate: overrides.issueDate ?? '2026-01-01',
    amount: overrides.amount ?? 100,
    status: overrides.status ?? 'Draft',
    createdAt: overrides.createdAt ?? '2026-01-01T00:00:00.000Z',
    updatedAt: overrides.updatedAt ?? '2026-01-01T00:00:00.000Z',
  }
}

describe('calculateDashboardStats', () => {
  it('calculates counts and totals from saved data only', () => {
    const quotes = [
      makeQuote({ id: 'q1', status: 'Draft', amount: 100 }),
      makeQuote({ id: 'q2', status: 'Sent', amount: 200 }),
      makeQuote({ id: 'q3', status: 'Accepted', amount: 300 }),
      makeQuote({ id: 'q4', status: 'Rejected', amount: 400 }),
      makeQuote({ id: 'q5', status: 'Accepted', amount: 50 }),
    ]
    const stats = calculateDashboardStats(clients, quotes)
    expect(stats.totalClients).toBe(2)
    expect(stats.totalQuotes).toBe(5)
    expect(stats.draft).toBe(1)
    expect(stats.sent).toBe(1)
    expect(stats.accepted).toBe(2)
    expect(stats.rejected).toBe(1)
    expect(stats.totalValue).toBe(1050)
    expect(stats.acceptedValue).toBe(350)
  })

  it('returns zeros for empty data instead of hard-coded values', () => {
    const stats = calculateDashboardStats([], [])
    expect(stats).toEqual({
      totalClients: 0,
      totalQuotes: 0,
      draft: 0,
      sent: 0,
      accepted: 0,
      rejected: 0,
      totalValue: 0,
      acceptedValue: 0,
    })
  })
})

describe('recentQuotes', () => {
  it('sorts newest issue date first and limits results', () => {
    const quotes = [
      makeQuote({ id: 'q1', issueDate: '2026-01-01' }),
      makeQuote({ id: 'q2', issueDate: '2026-03-01' }),
      makeQuote({ id: 'q3', issueDate: '2026-02-01' }),
    ]
    const result = recentQuotes(quotes, 2)
    expect(result.map((q) => q.id)).toEqual(['q2', 'q3'])
  })
})

describe('filterQuotes', () => {
  const quotes = [
    makeQuote({ id: 'q1', clientId: 'c1', number: 'QF-0001', description: 'Kitchen remodel', status: 'Draft' }),
    makeQuote({ id: 'q2', clientId: 'c2', number: 'QF-0002', description: 'Website audit', status: 'Sent' }),
    makeQuote({ id: 'q3', clientId: 'c1', number: 'QF-0003', description: 'Tax filing', status: 'Accepted' }),
  ]

  it('filters by status only', () => {
    const result = filterQuotes(quotes, clients, { search: '', status: 'Sent', clientId: 'All' })
    expect(result.map((q) => q.id)).toEqual(['q2'])
  })

  it('filters by client only', () => {
    const result = filterQuotes(quotes, clients, { search: '', status: 'All', clientId: 'c1' })
    expect(result.map((q) => q.id)).toEqual(['q1', 'q3'])
  })

  it('filters by search term across number, description, and client name', () => {
    const result = filterQuotes(quotes, clients, { search: 'kitchen', status: 'All', clientId: 'All' })
    expect(result.map((q) => q.id)).toEqual(['q1'])
  })

  it('combines search, status, and client filters', () => {
    const result = filterQuotes(quotes, clients, { search: 'tax', status: 'Accepted', clientId: 'c1' })
    expect(result.map((q) => q.id)).toEqual(['q3'])
  })

  it('returns no results when filters do not match anything', () => {
    const result = filterQuotes(quotes, clients, { search: 'nonexistent', status: 'All', clientId: 'All' })
    expect(result).toEqual([])
  })
})

describe('filterClients', () => {
  it('matches by name, company, email, or phone', () => {
    expect(filterClients(clients, 'alice').map((c) => c.id)).toEqual(['c1'])
    expect(filterClients(clients, 'brown llc').map((c) => c.id)).toEqual(['c2'])
    expect(filterClients(clients, 'bob@brown.llc').map((c) => c.id)).toEqual(['c2'])
    expect(filterClients(clients, '111').map((c) => c.id)).toEqual(['c1'])
  })

  it('returns all clients when search is empty', () => {
    expect(filterClients(clients, '')).toEqual(clients)
  })
})
