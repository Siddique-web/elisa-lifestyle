import { formatMt } from '../constants';

export default function AdminStats({ appointments }) {
  const total = appointments.length;
  const pendentes = appointments.filter((a) => a.status === 'Pendente').length;
  const confirmados = appointments.filter((a) => a.status === 'Confirmado').length;
  const receita = appointments
    .filter((a) => a.status !== 'Cancelado')
    .reduce(
      (sum, a) => sum + (a.services?.reduce((s, x) => s + x.price, 0) ?? 0),
      0
    );

  const cards = [
    { label: 'Agendamentos', value: total, sub: 'Total na lista' },
    { label: 'Pendentes', value: pendentes, sub: 'Aguardam confirmação' },
    { label: 'Confirmados', value: confirmados, sub: 'Próximos atendimentos' },
    { label: 'Receita estimada', value: formatMt(receita), sub: 'Excl. cancelados' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="admin-stat-card">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{c.label}</p>
          <p className="text-2xl font-bold text-brand-600">{c.value}</p>
          <p className="text-xs text-ink-400">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
