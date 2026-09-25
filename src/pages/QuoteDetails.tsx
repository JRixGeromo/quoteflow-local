import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BlueprintCorners } from '../components/BlueprintCorners'
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
        <p className="text-sm text-ink/70">This quote could not be found. It may have been deleted.</p>
        <Link to="/quotes" className="btn btn-ghost mt-4 p-0!">
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
            <Link to={`/quotes/${quote.id}/edit`} className="btn btn-secondary blueprint">
              <BlueprintCorners />
              Edit
            </Link>
            <button type="button" onClick={() => setConfirmingDelete(true)} className="btn btn-danger">
              Delete
            </button>
          </>
        }
      />

      {successMessage && (
        <div className="mb-4 border border-[color:var(--color-status-accepted-text)] bg-[color:var(--color-status-accepted-bg)] px-4 py-3 text-sm text-[color:var(--color-status-accepted-text)]">
          {successMessage}
        </div>
      )}

      <div className="card blueprint max-w-[560px] gap-5 p-6">
        <BlueprintCorners />
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

      <Link to="/quotes" className="btn btn-ghost mt-6 p-0!">
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
      <dt className="text-xs text-ink/70">{label}</dt>
      <dd className="mt-1 text-[15px] text-ink">{value}</dd>
    </div>
  )
}
