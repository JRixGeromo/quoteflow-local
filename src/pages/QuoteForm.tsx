import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BlueprintCorners } from '../components/BlueprintCorners'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../lib/DataContext'
import { todayISO } from '../lib/format'
import { validateQuoteForm, type QuoteFormErrors, type QuoteFormValues } from '../lib/quotes'
import { QUOTE_STATUSES, type QuoteStatus } from '../types'

export function QuoteForm() {
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()
  const { clients, getQuoteById, addQuote, updateQuote } = useData()

  const existingQuote = isEditMode && id ? getQuoteById(id) : undefined
  const notFound = isEditMode && !existingQuote

  const [values, setValues] = useState<QuoteFormValues>(() => ({
    clientId: existingQuote?.clientId ?? '',
    description: existingQuote?.description ?? '',
    issueDate: existingQuote?.issueDate ?? todayISO(),
    amount: existingQuote ? String(existingQuote.amount) : '',
    status: existingQuote?.status ?? 'Draft',
  }))
  const [errors, setErrors] = useState<QuoteFormErrors>({})

  const setField = <K extends keyof QuoteFormValues>(field: K, value: QuoteFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validateQuoteForm(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const amountNum = Number(values.amount)

    if (isEditMode && existingQuote) {
      updateQuote(existingQuote.id, {
        clientId: values.clientId,
        description: values.description,
        issueDate: values.issueDate,
        amount: amountNum,
        status: values.status,
      })
      navigate(`/quotes/${existingQuote.id}?updated=1`)
    } else {
      const created = addQuote({
        clientId: values.clientId,
        description: values.description,
        issueDate: values.issueDate,
        amount: amountNum,
      })
      navigate(`/quotes/${created.id}?created=1`)
    }
  }

  const handleCancel = () => {
    if (isEditMode && existingQuote) {
      navigate(`/quotes/${existingQuote.id}`)
    } else {
      navigate('/quotes')
    }
  }

  if (notFound) {
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

  return (
    <div>
      <PageHeader
        title={isEditMode ? `Edit Quote ${existingQuote?.number ?? ''}` : 'New Quote'}
        description={
          isEditMode
            ? 'Update the quote details below.'
            : 'Fill in the details below. The quote number and Draft status are assigned automatically.'
        }
      />

      <form onSubmit={handleSubmit} className="card blueprint max-w-2xl gap-5 p-6">
        <BlueprintCorners />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {isEditMode && existingQuote && (
            <div className="sm:col-span-2">
              <label className="field-label">Quote Number</label>
              <input type="text" value={existingQuote.number} disabled className="input" />
            </div>
          )}

          <div className="sm:col-span-2">
            <label htmlFor="clientId" className="field-label">
              Client
            </label>
            <select
              id="clientId"
              value={values.clientId}
              onChange={(event) => setField('clientId', event.target.value)}
              className="input"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.company})
                </option>
              ))}
            </select>
            {errors.clientId && <p className="mt-1 text-sm text-[#a13c2c]">{errors.clientId}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="field-label">
              Description
            </label>
            <textarea
              id="description"
              value={values.description}
              onChange={(event) => setField('description', event.target.value)}
              rows={3}
              className="input"
            />
            {errors.description && <p className="mt-1 text-sm text-[#a13c2c]">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="issueDate" className="field-label">
              Issue Date
            </label>
            <input
              id="issueDate"
              type="date"
              value={values.issueDate}
              onChange={(event) => setField('issueDate', event.target.value)}
              className="input"
            />
            {errors.issueDate && <p className="mt-1 text-sm text-[#a13c2c]">{errors.issueDate}</p>}
          </div>

          <div>
            <label htmlFor="amount" className="field-label">
              Amount (USD)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={values.amount}
              onChange={(event) => setField('amount', event.target.value)}
              placeholder="0.00"
              className="input"
            />
            {errors.amount && <p className="mt-1 text-sm text-[#a13c2c]">{errors.amount}</p>}
          </div>

          {isEditMode ? (
            <div className="sm:col-span-2">
              <label htmlFor="status" className="field-label">
                Status
              </label>
              <select
                id="status"
                value={values.status}
                onChange={(event) => setField('status', event.target.value as QuoteStatus)}
                className="input"
              >
                {QUOTE_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-sm text-[#a13c2c]">{errors.status}</p>}
            </div>
          ) : (
            <div className="sm:col-span-2">
              <p className="text-sm text-ink/60">New quotes start with status Draft.</p>
            </div>
          )}
        </div>

        <div className="mt-1 flex justify-end gap-2.5">
          <button type="button" onClick={handleCancel} className="btn btn-secondary blueprint">
            <BlueprintCorners />
            Cancel
          </button>
          <button type="submit" className="btn btn-primary blueprint">
            <BlueprintCorners />
            {isEditMode ? 'Save Changes' : 'Create Quote'}
          </button>
        </div>
      </form>
    </div>
  )
}
