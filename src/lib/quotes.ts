import { QUOTE_STATUSES, type Client, type Quote, type QuoteStatus } from '../types'

export function formatQuoteNumber(sequence: number): string {
  return `QF-${String(sequence).padStart(4, '0')}`
}

export function nextQuoteNumber(currentSequence: number): { number: string; sequence: number } {
  const sequence = currentSequence + 1
  return { number: formatQuoteNumber(sequence), sequence }
}

export interface QuoteFormValues {
  clientId: string
  description: string
  issueDate: string
  amount: string
  status: QuoteStatus
}

export interface QuoteFormErrors {
  clientId?: string
  description?: string
  issueDate?: string
  amount?: string
  status?: string
}

export function parseAmount(raw: string): number {
  return Number(raw)
}

export function validateQuoteForm(values: QuoteFormValues): QuoteFormErrors {
  const errors: QuoteFormErrors = {}

  if (!values.clientId.trim()) {
    errors.clientId = 'Please select a client.'
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.'
  }

  if (!values.issueDate.trim()) {
    errors.issueDate = 'Issue date is required.'
  }

  const trimmedAmount = values.amount.trim()
  if (!trimmedAmount) {
    errors.amount = 'Amount is required.'
  } else {
    const amountNum = parseAmount(trimmedAmount)
    if (Number.isNaN(amountNum)) {
      errors.amount = 'Enter a valid dollar amount.'
    } else if (amountNum <= 0) {
      errors.amount = 'Amount must be greater than zero.'
    }
  }

  if (!QUOTE_STATUSES.includes(values.status)) {
    errors.status = 'Select a valid status.'
  }

  return errors
}

export interface DashboardStats {
  totalClients: number
  totalQuotes: number
  draft: number
  sent: number
  accepted: number
  rejected: number
  totalValue: number
  acceptedValue: number
}

export function calculateDashboardStats(clients: Client[], quotes: Quote[]): DashboardStats {
  const stats: DashboardStats = {
    totalClients: clients.length,
    totalQuotes: quotes.length,
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    totalValue: 0,
    acceptedValue: 0,
  }

  for (const quote of quotes) {
    stats.totalValue += quote.amount
    switch (quote.status) {
      case 'Draft':
        stats.draft += 1
        break
      case 'Sent':
        stats.sent += 1
        break
      case 'Accepted':
        stats.accepted += 1
        stats.acceptedValue += quote.amount
        break
      case 'Rejected':
        stats.rejected += 1
        break
    }
  }

  return stats
}

export function recentQuotes(quotes: Quote[], limit = 5): Quote[] {
  return [...quotes]
    .sort((a, b) => {
      if (a.issueDate === b.issueDate) {
        return b.createdAt.localeCompare(a.createdAt)
      }
      return b.issueDate.localeCompare(a.issueDate)
    })
    .slice(0, limit)
}

export interface QuoteFilters {
  search: string
  status: QuoteStatus | 'All'
  clientId: string | 'All'
}

export function filterQuotes(quotes: Quote[], clients: Client[], filters: QuoteFilters): Quote[] {
  const clientById = new Map(clients.map((client) => [client.id, client]))
  const term = filters.search.trim().toLowerCase()

  return quotes.filter((quote) => {
    if (filters.status !== 'All' && quote.status !== filters.status) return false
    if (filters.clientId !== 'All' && quote.clientId !== filters.clientId) return false
    if (!term) return true

    const client = clientById.get(quote.clientId)
    const haystack = [quote.number, quote.description, client?.name, client?.company]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
}

export function filterClients(clients: Client[], search: string): Client[] {
  const term = search.trim().toLowerCase()
  if (!term) return clients
  return clients.filter((client) =>
    [client.name, client.company, client.email, client.phone].some((value) =>
      value.toLowerCase().includes(term),
    ),
  )
}
