import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useData } from '../lib/DataContext'
import { formatCurrency, formatDate } from '../lib/format'
import { filterQuotes } from '../lib/quotes'
import { QUOTE_STATUSES, type Quote, type QuoteStatus } from '../types'

export function Quotes() {
  const { clients, quotes, getClientById, deleteQuote } = useData()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<QuoteStatus | 'All'>('All')
  const [clientId, setClientId] = useState<string | 'All'>('All')
  const [pendingDelete, setPendingDelete] = useState<Quote | null>(null)

  const filtered = filterQuotes(quotes, clients, { search, status, clientId })

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return
    deleteQuote(pendingDelete.id)
    setPendingDelete(null)
  }

  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Create, search, and manage every quote."
        actions={
          <Link
            to="/quotes/new"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            New Quote
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by quote number, client, or description"
          className="w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Search quotes"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as QuoteStatus | 'All')}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Filter by status"
        >
          <option value="All">All statuses</option>
          {QUOTE_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Filter by client"
        >
          <option value="All">All clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No quotes match your search or filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Quote #</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Issue Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link
                        to={`/quotes/${quote.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        {quote.number}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {getClientById(quote.clientId)?.name ?? 'Unknown client'}
                    </td>
                    <td className="px-5 py-3 max-w-xs truncate text-slate-700">
                      {quote.description}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{formatDate(quote.issueDate)}</td>
                    <td className="px-5 py-3 text-slate-700">{formatCurrency(quote.amount)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-3 text-sm font-medium">
                        <Link to={`/quotes/${quote.id}`} className="text-indigo-600 hover:text-indigo-700">
                          View
                        </Link>
                        <Link
                          to={`/quotes/${quote.id}/edit`}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(quote)}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete quote"
          message={`Delete quote ${pendingDelete.number} for ${
            getClientById(pendingDelete.clientId)?.name ?? 'this client'
          }? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
