import { beforeEach, describe, expect, it } from 'vitest'
import { storage } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips clients and quotes through localStorage', () => {
    const clients = [
      { id: 'c1', name: 'Alice', company: 'Adams Co', email: 'a@a.com', phone: '111', notes: '' },
    ]
    storage.setClients(clients)
    expect(storage.getClients()).toEqual(clients)
  })

  it('returns empty arrays when nothing has been saved', () => {
    expect(storage.getClients()).toEqual([])
    expect(storage.getQuotes()).toEqual([])
    expect(storage.getSequence()).toBe(0)
  })

  it('persists the sequence counter independently of quote deletions', () => {
    storage.setSequence(3)
    storage.setQuotes([])
    expect(storage.getSequence()).toBe(3)
  })

  it('filters out quotes left over from an incompatible schema instead of surfacing them', () => {
    localStorage.setItem(
      'quoteflow.quotes',
      JSON.stringify([
        // Foreign/legacy shape: no clientId/amount/number as this app expects.
        { id: 'legacy-1', client: 'Some Client', total: '1200.00', desc: 'Old app record' },
        {
          id: 'q1',
          number: 'QF-0001',
          clientId: 'c1',
          description: 'Valid quote',
          issueDate: '2026-01-01',
          amount: 100,
          status: 'Draft',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ]),
    )
    const quotes = storage.getQuotes()
    expect(quotes).toHaveLength(1)
    expect(quotes[0].id).toBe('q1')
  })

  it('falls back to 0 when the stored sequence is not a valid number', () => {
    localStorage.setItem('quoteflow.quoteSequence', JSON.stringify('not-a-number'))
    expect(storage.getSequence()).toBe(0)
  })
})
