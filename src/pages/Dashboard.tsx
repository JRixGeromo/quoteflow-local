import { Link } from 'react-router-dom'
import { BlueprintCorners } from '../components/BlueprintCorners'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useData } from '../lib/DataContext'
import { formatCurrency, formatDate } from '../lib/format'
import { calculateDashboardStats, recentQuotes } from '../lib/quotes'

export function Dashboard() {
  const { clients, quotes, getClientById } = useData()
  const stats = calculateDashboardStats(clients, quotes)
  const recent = recentQuotes(quotes, 5)

  const cards = [
    { label: 'Total Clients', value: stats.totalClients.toString() },
    { label: 'Total Quotes', value: stats.totalQuotes.toString() },
    { label: 'Draft', value: stats.draft.toString() },
    { label: 'Sent', value: stats.sent.toString() },
    { label: 'Accepted', value: stats.accepted.toString() },
    { label: 'Rejected', value: stats.rejected.toString() },
    { label: 'Total Quote Value', value: formatCurrency(stats.totalValue) },
    { label: 'Accepted Quote Value', value: formatCurrency(stats.acceptedValue) },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A live overview of your clients and quotes."
        actions={
          <Link to="/quotes/new" className="btn btn-primary blueprint">
            <BlueprintCorners />
            <PlusIcon />
            New Quote
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="stat-card blueprint">
            <BlueprintCorners />
            <p className="stat-card-label">{card.label}</p>
            <p className="stat-card-value">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="card blueprint mt-8 p-0">
        <BlueprintCorners />
        <div className="flex items-center justify-between border-b border-[color:var(--color-divider)] px-5 py-4">
          <h2 className="text-lg">Recent Quotes</h2>
          <Link to="/quotes" className="btn btn-ghost">
            View all quotes
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ink/60">
            No quotes yet. Create your first quote to get started.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto sm:block">
              <table className="table">
                <thead>
                  <tr>
                    <th className="pl-5">Quote #</th>
                    <th>Client</th>
                    <th>Issue Date</th>
                    <th>Amount</th>
                    <th className="pr-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((quote) => (
                    <tr key={quote.id}>
                      <td className="pl-5">
                        <Link to={`/quotes/${quote.id}`} className="btn btn-ghost p-0! text-sm">
                          {quote.number}
                        </Link>
                      </td>
                      <td>{getClientById(quote.clientId)?.name ?? 'Unknown client'}</td>
                      <td className="text-ink/60">{formatDate(quote.issueDate)}</td>
                      <td>{formatCurrency(quote.amount)}</td>
                      <td className="pr-5">
                        <StatusBadge status={quote.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[color:var(--color-divider)] sm:hidden">
              {recent.map((quote) => (
                <div key={quote.id} className="flex flex-col gap-1.5 px-4 py-3.5">
                  <div className="flex items-center justify-between">
                    <Link to={`/quotes/${quote.id}`} className="btn btn-ghost p-0! text-sm">
                      {quote.number}
                    </Link>
                    <StatusBadge status={quote.status} />
                  </div>
                  <div className="text-sm">{getClientById(quote.clientId)?.name ?? 'Unknown client'}</div>
                  <div className="flex justify-between text-xs text-ink/60">
                    <span>{formatDate(quote.issueDate)}</span>
                    <span>{formatCurrency(quote.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
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
