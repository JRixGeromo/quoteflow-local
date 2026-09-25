import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BlueprintCorners } from '../components/BlueprintCorners'
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
  const hasActiveFilters = search !== '' || status !== 'All' || clientId !== 'All'
  const isTrulyEmpty = filtered.length === 0 && quotes.length === 0
  const isFilteredEmpty = filtered.length === 0 && quotes.length > 0

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return
    deleteQuote(pendingDelete.id)
    setPendingDelete(null)
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('All')
    setClientId('All')
  }

  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Create, search, and manage every quote."
        actions={
          <Link to="/quotes/new" className="btn btn-primary blueprint">
            <BlueprintCorners />
            <PlusIcon />
            New Quote
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by quote number, client, or description"
          className="input w-full sm:max-w-md sm:flex-[2]"
          aria-label="Search quotes"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as QuoteStatus | 'All')}
          className="input sm:flex-1"
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
          className="input sm:flex-1"
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

      {filtered.length > 0 && (
        <>
          <div className="card blueprint hidden overflow-x-auto p-0 sm:block">
            <BlueprintCorners />
            <table className="table">
              <thead>
                <tr>
                  <th className="pl-5">Quote #</th>
                  <th>Client</th>
                  <th>Description</th>
                  <th>Issue Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((quote) => (
                  <tr key={quote.id}>
                    <td className="pl-5">
                      <Link to={`/quotes/${quote.id}`} className="btn btn-ghost p-0! text-sm">
                        {quote.number}
                      </Link>
                    </td>
                    <td>{getClientById(quote.clientId)?.name ?? 'Unknown client'}</td>
                    <td className="max-w-xs truncate">{quote.description}</td>
                    <td className="text-ink/60">{formatDate(quote.issueDate)}</td>
                    <td>{formatCurrency(quote.amount)}</td>
                    <td>
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="pr-5">
                      <div className="flex justify-end gap-3.5 text-sm">
                        <Link to={`/quotes/${quote.id}`} className="btn btn-ghost p-0!">
                          View
                        </Link>
                        <Link to={`/quotes/${quote.id}/edit`} className="btn btn-ghost p-0!">
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(quote)}
                          className="btn btn-ghost p-0! text-[#a13c2c]! hover:bg-[#a13c2c]/10!"
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

          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map((quote) => (
              <div key={quote.id} className="card blueprint flex flex-col gap-2">
                <BlueprintCorners />
                <div className="flex items-center justify-between">
                  <Link to={`/quotes/${quote.id}`} className="btn btn-ghost p-0! text-[15px] font-semibold">
                    {quote.number}
                  </Link>
                  <StatusBadge status={quote.status} />
                </div>
                <div className="text-sm font-semibold">
                  {getClientById(quote.clientId)?.name ?? 'Unknown client'}
                </div>
                <div className="line-clamp-2 text-sm text-ink/60">{quote.description}</div>
                <div className="flex justify-between text-xs text-ink/60">
                  <span>{formatDate(quote.issueDate)}</span>
                  <span>{formatCurrency(quote.amount)}</span>
                </div>
                <div className="mt-0.5 flex gap-4 border-t border-[color:var(--color-divider)] pt-2">
                  <Link to={`/quotes/${quote.id}`} className="btn btn-ghost p-0! text-sm">
                    View
                  </Link>
                  <Link to={`/quotes/${quote.id}/edit`} className="btn btn-ghost p-0! text-sm">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(quote)}
                    className="btn btn-ghost p-0! text-sm text-[#a13c2c]! hover:bg-[#a13c2c]/10!"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isTrulyEmpty && (
        <div className="card blueprint flex flex-col items-center gap-3 px-6 py-14 text-center">
          <BlueprintCorners />
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth={1.5}>
            <path d="M22 12h-6l-2 3h-4l-2-3H2" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
          <h3>No quotes yet</h3>
          <p className="mx-auto max-w-[36ch] text-sm text-ink/60">
            Create your first quote to start tracking work for your clients.
          </p>
          <Link to="/quotes/new" className="btn btn-primary blueprint mt-1">
            <BlueprintCorners />
            New Quote
          </Link>
        </div>
      )}

      {isFilteredEmpty && (
        <div className="card blueprint flex flex-col items-center gap-3 px-6 py-14 text-center">
          <BlueprintCorners />
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth={1.5}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="m8 8 6 6" />
            <path d="m14 8-6 6" />
          </svg>
          <h3>No quotes match your search or filters</h3>
          <p className="mx-auto max-w-[36ch] text-sm text-ink/60">
            Try a different search term, or clear the filters to see every quote.
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="btn btn-secondary blueprint mt-1">
              <BlueprintCorners />
              Clear filters
            </button>
          )}
        </div>
      )}

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

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
