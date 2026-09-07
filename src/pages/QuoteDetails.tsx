import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useData } from '../lib/DataContext'
import { formatCurrency, formatDate } from '../lib/format'

export function QuoteDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getQuoteById, getClientById, deleteQuote } = useData()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const quote = id ? getQuoteById(id) : undefined

  if (!quote) {
    return (
      <div>
        <PageHeader title="Quote not found" />
        <p className="text-sm text-slate-600">
          This quote could not be found. It may have been deleted.
        </p>
        <Link to="/quotes" className="mt-4 inline-block text-sm font-medium text-indigo-600">
          Back to Quotes
        </Link>
      </div>
    )
  }

  const client = getClientById(quote.clientId)
  const successMessage =
    searchParams.get('created') === '1'
      ? 'Quote created successfully.'
      : searchParams.get('updated') === '1'
        ? 'Quote updated successfully.'
        : null

  const handleDeleteConfirm = () => {
    deleteQuote(quote.id)
    navigate('/quotes')
  }

  return (
    <div>
      <PageHeader
        title={`Quote ${quote.number}`}
        description="Full details for this quote."
        actions={
          <>
            <Link
              to={`/quotes/${quote.id}/edit`}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-md border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              Delete
            </button>
          </>
        }
      />

      {successMessage && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Quote Number" value={quote.number} />
          <Field label="Status" value={<StatusBadge status={quote.status} />} />
          <Field label="Client" value={client?.name ?? 'Unknown client'} />
          <Field label="Company" value={client?.company ?? '-'} />
          <Field label="Issue Date" value={formatDate(quote.issueDate)} />
          <Field label="Amount" value={formatCurrency(quote.amount)} />
          <div className="sm:col-span-2">
            <Field label="Description" value={quote.description} />
          </div>
        </dl>
      </div>

      <Link to="/quotes" className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
        Back to Quotes
      </Link>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete quote"
          message={`Delete quote ${quote.number} for ${client?.name ?? 'this client'}? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{value}</dd>
    </div>
  )
}
