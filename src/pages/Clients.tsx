import { useState } from 'react'
import { BlueprintCorners } from '../components/BlueprintCorners'
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
          className="input w-full max-w-md"
          aria-label="Search clients"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card blueprint flex flex-col items-center gap-3 px-6 py-14 text-center">
          <BlueprintCorners />
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth={1.5}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="m8 8 6 6" />
            <path d="m14 8-6 6" />
          </svg>
          <h3>No clients match your search</h3>
        </div>
      ) : (
        <>
          <div className="card blueprint hidden p-0 sm:block">
            <BlueprintCorners />
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="pl-5">Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th className="pr-5">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr key={client.id}>
                      <td className="pl-5 font-medium text-ink">{client.name}</td>
                      <td>{client.company}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td className="pr-5 text-ink/60">{client.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map((client) => (
              <div key={client.id} className="card blueprint flex flex-col gap-1.5">
                <BlueprintCorners />
                <div className="text-sm font-semibold text-ink">{client.name}</div>
                <div className="text-sm text-ink/70">{client.company}</div>
                <div className="text-xs text-ink/60">{client.email}</div>
                <div className="text-xs text-ink/60">{client.phone}</div>
                {client.notes && <div className="mt-1 text-xs text-ink/60">{client.notes}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
