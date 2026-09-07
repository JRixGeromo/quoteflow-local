import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Client, Quote, QuoteStatus } from '../types'
import { ensureSeedData } from './seed'
import { storage } from './storage'
import { nextQuoteNumber } from './quotes'

export interface NewQuoteInput {
  clientId: string
  description: string
  issueDate: string
  amount: number
}

export interface EditQuoteInput {
  clientId: string
  description: string
  issueDate: string
  amount: number
  status: QuoteStatus
}

interface DataContextValue {
  clients: Client[]
  quotes: Quote[]
  getClientById: (id: string) => Client | undefined
  getQuoteById: (id: string) => Quote | undefined
  addQuote: (values: NewQuoteInput) => Quote
  updateQuote: (id: string, values: EditQuoteInput) => void
  deleteQuote: (id: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  useMemo(() => ensureSeedData(), [])

  const [clients] = useState<Client[]>(() => storage.getClients())
  const [quotes, setQuotes] = useState<Quote[]>(() => storage.getQuotes())

  const getClientById = useCallback(
    (id: string) => clients.find((client) => client.id === id),
    [clients],
  )

  const getQuoteById = useCallback(
    (id: string) => quotes.find((quote) => quote.id === id),
    [quotes],
  )

  const addQuote = useCallback(
    (values: NewQuoteInput): Quote => {
      const currentSequence = storage.getSequence()
      const { number, sequence } = nextQuoteNumber(currentSequence)
      const now = new Date().toISOString()
      const quote: Quote = {
        id: crypto.randomUUID(),
        number,
        clientId: values.clientId,
        description: values.description.trim(),
        issueDate: values.issueDate,
        amount: values.amount,
        status: 'Draft',
        createdAt: now,
        updatedAt: now,
      }
      const next = [...quotes, quote]
      storage.setQuotes(next)
      storage.setSequence(sequence)
      setQuotes(next)
      return quote
    },
    [quotes],
  )

  const updateQuote = useCallback(
    (id: string, values: EditQuoteInput): void => {
      const now = new Date().toISOString()
      const next = quotes.map((quote) =>
        quote.id === id
          ? {
              ...quote,
              clientId: values.clientId,
              description: values.description.trim(),
              issueDate: values.issueDate,
              amount: values.amount,
              status: values.status,
              updatedAt: now,
            }
          : quote,
      )
      storage.setQuotes(next)
      setQuotes(next)
    },
    [quotes],
  )

  const deleteQuote = useCallback(
    (id: string): void => {
      const next = quotes.filter((quote) => quote.id !== id)
      storage.setQuotes(next)
      setQuotes(next)
    },
    [quotes],
  )

  const value = useMemo(
    () => ({ clients, quotes, getClientById, getQuoteById, addQuote, updateQuote, deleteQuote }),
    [clients, quotes, getClientById, getQuoteById, addQuote, updateQuote, deleteQuote],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}
