import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
        <p className="text-sm text-slate-600">
          This quote could not be found. It may have been deleted.
        </p>
        <Link to="/quotes" className="mt-4 inline-block text-sm font-medium text-indigo-600">
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

      <form onSubmit={handleSubmit} className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {isEditMode && existingQuote && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Quote Number</label>
              <input
                type="text"
                value={existingQuote.number}
                disabled
                className="mt-1 w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label htmlFor="clientId" className="block text-sm font-medium text-slate-700">
              Client
            </label>
            <select
              id="clientId"
              value={values.clientId}
              onChange={(event) => setField('clientId', event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.company})
                </option>
              ))}
            </select>
            {errors.clientId && <p className="mt-1 text-sm text-rose-600">{errors.clientId}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              value={values.description}
              onChange={(event) => setField('description', event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.description && <p className="mt-1 text-sm text-rose-600">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700">
              Issue Date
            </label>
            <input
              id="issueDate"
              type="date"
              value={values.issueDate}
              onChange={(event) => setField('issueDate', event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.issueDate && <p className="mt-1 text-sm text-rose-600">{errors.issueDate}</p>}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
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
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.amount && <p className="mt-1 text-sm text-rose-600">{errors.amount}</p>}
          </div>

          {isEditMode ? (
            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                value={values.status}
                onChange={(event) => setField('status', event.target.value as QuoteStatus)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {QUOTE_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-sm text-rose-600">{errors.status}</p>}
            </div>
          ) : (
            <div className="sm:col-span-2">
              <p className="text-sm text-slate-500">New quotes start with status Draft.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {isEditMode ? 'Save Changes' : 'Create Quote'}
          </button>
        </div>
      </form>
    </div>
  )
}
