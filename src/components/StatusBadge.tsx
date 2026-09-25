import type { QuoteStatus } from '../types'

const STYLES: Record<QuoteStatus, string> = {
  Draft: 'bg-status-draft-bg text-status-draft-text',
  Sent: 'bg-status-sent-bg text-status-sent-text',
  Accepted: 'bg-status-accepted-bg text-status-accepted-text',
  Rejected: 'bg-status-rejected-bg text-status-rejected-text',
}

export function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-[3px] px-2.5 py-1 text-[11px] font-medium tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  )
}
