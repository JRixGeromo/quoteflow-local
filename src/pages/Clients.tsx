import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../lib/DataContext'
import { filterClients } from '../lib/quotes'

export function Clients() {
  const { clients } = useData()
  const [search, setSearch] = useState('')
  const filtered = filterClients(clients, search)

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Read-only client directory. Clients are managed outside QuoteFlow."
      />

      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, company, email, or phone"
          className="w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Search clients"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No clients match your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{client.name}</td>
                    <td className="px-5 py-3 text-slate-700">{client.company}</td>
                    <td className="px-5 py-3 text-slate-700">{client.email}</td>
                    <td className="px-5 py-3 text-slate-700">{client.phone}</td>
                    <td className="px-5 py-3 text-slate-500">{client.notes}</td>
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
