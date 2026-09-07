import { QUOTE_STATUSES, type Client, type Quote } from '../types'

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isValidClient(value: unknown): value is Client {
  if (!value || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  return (
    isNonEmptyString(c.id) &&
    isNonEmptyString(c.name) &&
    typeof c.company === 'string' &&
    typeof c.email === 'string' &&
    typeof c.phone === 'string' &&
    typeof c.notes === 'string'
  )
}

export function isValidQuote(value: unknown): value is Quote {
  if (!value || typeof value !== 'object') return false
  const q = value as Record<string, unknown>
  return (
    isNonEmptyString(q.id) &&
    isNonEmptyString(q.number) &&
    isNonEmptyString(q.clientId) &&
    isNonEmptyString(q.description) &&
    isNonEmptyString(q.issueDate) &&
    isFiniteNumber(q.amount) &&
    q.amount > 0 &&
    isNonEmptyString(q.status) &&
    (QUOTE_STATUSES as readonly string[]).includes(q.status) &&
    isNonEmptyString(q.createdAt) &&
    isNonEmptyString(q.updatedAt)
  )
}

export function sanitizeClients(raw: unknown): Client[] {
  return Array.isArray(raw) ? raw.filter(isValidClient) : []
}

export function sanitizeQuotes(raw: unknown): Quote[] {
  return Array.isArray(raw) ? raw.filter(isValidQuote) : []
}
