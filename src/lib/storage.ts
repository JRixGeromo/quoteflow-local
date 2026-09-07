import type { Client, Quote } from '../types'
import { sanitizeClients, sanitizeQuotes } from './sanitize'

const KEYS = {
  clients: 'quoteflow.clients',
  quotes: 'quoteflow.quotes',
  sequence: 'quoteflow.quoteSequence',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  getClients: (): Client[] => sanitizeClients(read<unknown>(KEYS.clients, [])),
  setClients: (clients: Client[]): void => write(KEYS.clients, clients),
  getQuotes: (): Quote[] => sanitizeQuotes(read<unknown>(KEYS.quotes, [])),
  setQuotes: (quotes: Quote[]): void => write(KEYS.quotes, quotes),
  getSequence: (): number => {
    const value = read<unknown>(KEYS.sequence, 0)
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0
  },
  setSequence: (n: number): void => write(KEYS.sequence, n),
}
