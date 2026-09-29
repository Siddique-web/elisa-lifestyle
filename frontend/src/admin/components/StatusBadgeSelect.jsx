import { APPOINTMENT_STATUSES, STATUS_STYLES } from '../constants';

export default function StatusBadgeSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-semibold ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-brand-400 ${STATUS_STYLES[value] || 'bg-brand-50 text-ink-800'}`}
      aria-label="Alterar estado do agendamento"
    >
      {APPOINTMENT_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
