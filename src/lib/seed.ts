import type { Client, Quote } from '../types'
import { storage } from './storage'

function createSeedClients(): Client[] {
  return [
    {
      id: 'c1',
      name: 'Sarah Mitchell',
      company: 'Mitchell & Co Consulting',
      email: 'sarah.mitchell@mitchellconsulting.com',
      phone: '(555) 201-3344',
      notes: 'Prefers email communication; net-30 payment terms.',
    },
    {
      id: 'c2',
      name: 'David Chen',
      company: 'Chen Digital Solutions',
      email: 'david@chendigital.io',
      phone: '(555) 478-2210',
      notes: 'Long-term client since 2023. Fast approver on quotes.',
    },
    {
      id: 'c3',
      name: 'Priya Patel',
      company: 'Patel & Associates Law',
      email: 'priya.patel@patellaw.com',
      phone: '(555) 902-6671',
      notes: 'Requires detailed, itemized descriptions on every quote.',
    },
    {
      id: 'c4',
      name: 'Marcus Johnson',
      company: 'Johnson Home Renovations',
      email: 'marcus@johnsonrenovations.com',
      phone: '(555) 334-8890',
      notes: 'Seasonal work; busiest March through October.',
    },
    {
      id: 'c5',
      name: 'Emily Rodriguez',
      company: 'Rodriguez Marketing Group',
      email: 'emily.r@rodriguezmarketing.com',
      phone: '(555) 667-1123',
      notes: 'Pays via bank transfer. Send invoices to accounting alias.',
    },
    {
      id: 'c6',
      name: 'Thomas Nguyen',
      company: 'Nguyen Tech Repairs',
      email: 'tom.nguyen@nguyentechrepairs.com',
      phone: '(555) 812-4456',
      notes: 'Referred by David Chen. New client, first project pending.',
    },
  ]
}

function createSeedQuotes(): Quote[] {
  const base: Array<Omit<Quote, 'number' | 'createdAt' | 'updatedAt'>> = [
    {
      id: 'q1',
      clientId: 'c1',
      description: 'Quarterly bookkeeping review and reconciliation',
      issueDate: '2026-01-12',
      amount: 1250,
      status: 'Accepted',
    },
    {
      id: 'q2',
      clientId: 'c2',
      description: 'Website performance audit and optimization plan',
      issueDate: '2026-02-03',
      amount: 2400,
      status: 'Sent',
    },
    {
      id: 'q3',
      clientId: 'c3',
      description: 'Contract review services - Q1 retainer',
      issueDate: '2026-02-18',
      amount: 3800,
      status: 'Accepted',
    },
    {
      id: 'q4',
      clientId: 'c4',
      description: 'Kitchen remodel - design consultation',
      issueDate: '2026-03-05',
      amount: 950,
      status: 'Draft',
    },
    {
      id: 'q5',
      clientId: 'c5',
      description: 'Social media campaign strategy - March launch',
      issueDate: '2026-03-14',
      amount: 1675.5,
      status: 'Sent',
    },
    {
      id: 'q6',
      clientId: 'c6',
      description: 'On-site network troubleshooting and repair',
      issueDate: '2026-04-02',
      amount: 425,
      status: 'Rejected',
    },
    {
      id: 'q7',
      clientId: 'c1',
      description: 'Annual tax preparation support',
      issueDate: '2026-04-20',
      amount: 2100,
      status: 'Draft',
    },
    {
      id: 'q8',
      clientId: 'c2',
      description: 'Mobile app UX review',
      issueDate: '2026-05-08',
      amount: 3200.75,
      status: 'Accepted',
    },
    {
      id: 'q9',
      clientId: 'c4',
      description: 'Bathroom renovation - materials and labor estimate',
      issueDate: '2026-05-22',
      amount: 5400,
      status: 'Sent',
    },
    {
      id: 'q10',
      clientId: 'c5',
      description: 'Brand identity refresh - logo and style guide',
      issueDate: '2026-06-10',
      amount: 2850,
      status: 'Rejected',
    },
  ]

  const now = new Date().toISOString()

  return base.map((quote, index) => ({
    ...quote,
    number: `QF-${String(index + 1).padStart(4, '0')}`,
    createdAt: now,
    updatedAt: now,
  }))
}

export function ensureSeedData(): void {
  // storage.getClients()/getQuotes() only ever return entries matching the
  // current Quote/Client shape. If localStorage holds no valid data - a
  // fresh browser, or leftover data from an incompatible schema - install
  // the baseline demo dataset. If the operator has legitimately used the
  // app (e.g. deleted every quote), valid clients still remain and this
  // does not overwrite their data.
  const hasValidClients = storage.getClients().length > 0
  const hasValidQuotes = storage.getQuotes().length > 0
  if (hasValidClients || hasValidQuotes) return

  const clients = createSeedClients()
  const quotes = createSeedQuotes()

  storage.setClients(clients)
  storage.setQuotes(quotes)
  storage.setSequence(quotes.length)
}
