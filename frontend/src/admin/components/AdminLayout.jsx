import { Link, NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/admin', label: 'Agendamentos', end: true },
  { to: '/admin/equipa', label: 'Agenda da Equipa' },
  { to: '/admin/relatorios', label: 'Relatórios & Insights' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-cream-100 text-ink-900">
      <header className="border-b border-brand-100 bg-cream-50/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-accent shadow-md shadow-primary/30">
              EL
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
                Elisa Lifestyle · Beira
              </p>
              <h1 className="text-xl font-bold text-ink-900">Painel Administrativo</h1>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              to="/"
              className="text-sm font-medium text-ink-500 transition hover:text-brand-500"
            >
              ← Site público
            </Link>
            <nav className="flex flex-wrap justify-end gap-2">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-primary text-light-bg shadow-md shadow-primary/25'
                        : 'bg-brand-50 text-ink-700 ring-1 ring-brand-100 hover:bg-brand-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
