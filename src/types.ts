export const QUOTE_STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected'] as const
export type QuoteStatus = (typeof QUOTE_STATUSES)[number]

export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  notes: string
}

export interface Quote {
  id: string
  number: string
  clientId: string
  description: string
  issueDate: string
  amount: number
  status: QuoteStatus
  createdAt: string
  updatedAt: string
}
