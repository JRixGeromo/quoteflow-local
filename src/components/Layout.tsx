import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { BlueprintCorners } from './BlueprintCorners'

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Dashboard',
    end: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/clients',
    label: 'Clients',
    end: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/quotes',
    label: 'Quotes',
    end: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
  },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 font-heading text-sm font-semibold transition-colors ${
              isActive ? 'bg-accent text-bg' : 'text-neutral-300 hover:text-white'
            }`
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 flex-col gap-1 bg-neutral-900 p-4 md:flex">
          <Brand />
          <NavLinks />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[color:var(--color-divider)] bg-bg px-4 py-3 md:hidden">
            <Brand compact />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="blueprint flex h-9 w-9 items-center justify-center border border-[color:var(--color-divider)] text-ink"
            >
              <BlueprintCorners />
              <span className="sr-only">Menu</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M4 12h16" />
                <path d="M4 6h16" />
                <path d="M4 18h16" />
              </svg>
            </button>
          </header>

          {mobileOpen && (
            <div
              className="fixed inset-0 z-30 bg-neutral-900/55 md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <div
                className="fixed left-0 top-0 flex h-full w-60 flex-col gap-1 overflow-y-auto bg-neutral-900 p-4"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-4">
                  <p className="font-heading text-lg font-semibold text-white">QuoteFlow</p>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="flex h-8 w-8 items-center justify-center text-accent"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M18 6 6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <NavLinks onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          <main className="flex-1 px-4 py-5 sm:px-6 md:px-10 md:py-8">
            <div className="max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${compact ? '' : 'mb-3 border-b border-white/10 pb-4'}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-accent font-heading text-sm font-semibold text-bg">
        QF
      </div>
      <div>
        <p className={`font-heading text-base font-semibold leading-tight ${compact ? 'text-ink' : 'text-white'}`}>
          QuoteFlow
        </p>
        <p className={`text-[11px] ${compact ? 'text-neutral-600' : 'text-neutral-500'}`}>Local environment</p>
      </div>
    </div>
  )
}
