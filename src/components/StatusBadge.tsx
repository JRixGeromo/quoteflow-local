import type { QuoteStatus } from '../types'

const STYLES: Record<QuoteStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700 ring-slate-300',
  Sent: 'bg-blue-100 text-blue-700 ring-blue-300',
  Accepted: 'bg-emerald-100 text-emerald-700 ring-emerald-300',
  Rejected: 'bg-rose-100 text-rose-700 ring-rose-300',
}

export function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {status}
    </span>
  )
}
