import { beforeEach, describe, expect, it } from 'vitest'
import { ensureSeedData } from './seed'
import { storage } from './storage'

describe('ensureSeedData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('installs the baseline demo dataset on a fresh browser', () => {
    ensureSeedData()
    expect(storage.getClients().length).toBeGreaterThanOrEqual(5)
    expect(storage.getQuotes().length).toBeGreaterThanOrEqual(8)
    expect(storage.getSequence()).toBe(storage.getQuotes().length)
  })

  it('repairs storage left over from an incompatible schema', () => {
    localStorage.setItem(
      'quoteflow.clients',
      JSON.stringify([{ id: 'legacy-1', clientName: 'Old Client' }]),
    )
    localStorage.setItem(
      'quoteflow.quotes',
      JSON.stringify([{ id: 'legacy-1', client: 'Old Client', total: '500.00' }]),
    )

    ensureSeedData()

    const clients = storage.getClients()
    const quotes = storage.getQuotes()
    expect(clients.length).toBeGreaterThanOrEqual(5)
    expect(quotes.length).toBeGreaterThanOrEqual(8)
    expect(quotes.every((quote) => Number.isFinite(quote.amount) && quote.amount > 0)).toBe(true)
  })

  it('does not overwrite legitimate data, such as every quote being deleted on purpose', () => {
    ensureSeedData()
    storage.setQuotes([])

    ensureSeedData()

    expect(storage.getClients().length).toBeGreaterThanOrEqual(5)
    expect(storage.getQuotes()).toEqual([])
  })
})
