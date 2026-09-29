export const APPOINTMENT_STATUSES = [
  'Pendente',
  'Confirmado',
  'Adiado',
  'Concluído',
  'Cancelado',
];

export const STATUS_STYLES = {
  Pendente: 'bg-amber-50 text-amber-800 ring-amber-200',
  Confirmado: 'bg-brand-50 text-brand-700 ring-brand-200',
  Adiado: 'bg-violet-50 text-violet-800 ring-violet-200',
  'Concluído': 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  Cancelado: 'bg-rose-50 text-rose-800 ring-rose-200',
};

export const WEEK_DAYS = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-MZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMt(value) {
  return `${Number(value).toLocaleString('pt-MZ')} Mt`;
}
