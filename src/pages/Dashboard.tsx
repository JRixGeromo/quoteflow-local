import { Link } from 'react-router-dom'
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
          <Link
            to="/quotes/new"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            New Quote
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Quotes</h2>
          <Link to="/quotes" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all quotes
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No quotes yet. Create your first quote to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Quote #</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Issue Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((quote) => (
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
                    <td className="px-5 py-3 text-slate-700">{formatDate(quote.issueDate)}</td>
                    <td className="px-5 py-3 text-slate-700">{formatCurrency(quote.amount)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={quote.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
