import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';
import { formatDateTime, formatMt } from '../constants';
import StatusBadgeSelect from './StatusBadgeSelect';
import AdminStats from './AdminStats';

function sortByDate(appointments) {
  return [...appointments].sort(
    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
  );
}

function upsertAppointment(list, item) {
  const idx = list.findIndex((a) => a._id === item._id);
  if (idx === -1) return sortByDate([item, ...list]);
  const next = [...list];
  next[idx] = item;
  return sortByDate(next);
}

function staffIdOf(appointment) {
  const s = appointment?.staffMember;
  if (!s) return '';
  if (typeof s === 'string') return s;
  return s._id || '';
}

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const [data, team] = await Promise.all([api.getAppointments(), api.getStaff()]);
      setAppointments(sortByDate(data));
      setStaff(Array.isArray(team) ? team : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const socket = getSocket();
    const onNew = (item) => setAppointments((prev) => upsertAppointment(prev, item));
    const onStatus = (item) => setAppointments((prev) => upsertAppointment(prev, item));
    const onStaff = (item) => setAppointments((prev) => upsertAppointment(prev, item));

    socket.on('new-appointment', onNew);
    socket.on('status-updated', onStatus);
    socket.on('staff-assigned', onStaff);

    return () => {
      socket.off('new-appointment', onNew);
      socket.off('status-updated', onStatus);
      socket.off('staff-assigned', onStaff);
    };
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const updated = await api.patchAppointmentStatus(id, status);
      setAppointments((prev) => upsertAppointment(prev, updated));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStaffChange = async (id, staffMember) => {
    setUpdatingId(id);
    try {
      const updated = await api.patchAppointmentStaff(id, staffMember);
      setAppointments((prev) => upsertAppointment(prev, updated));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <p className="glow-card p-8 text-center text-ink-500">
        A carregar agendamentos...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <AdminStats appointments={appointments} />
      <div className="glow-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Próximos atendimentos</h2>
          <p className="text-sm text-ink-500">
            Atribua um profissional a cada pedido e actualize o estado em tempo real
          </p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-brand-100">
          {appointments.length} registos
        </span>
      </div>

      {error && (
        <p className="mx-5 mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-50/80 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Data / Hora</th>
              <th className="px-5 py-3 font-medium">Serviços</th>
              <th className="px-5 py-3 font-medium">Visita</th>
              <th className="px-5 py-3 font-medium">Profissional</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-ink-500">
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            ) : (
              appointments.map((a) => {
                const total = a.services?.reduce((s, x) => s + x.price, 0) ?? 0;
                return (
                  <tr key={a._id} className="transition hover:bg-brand-50/50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink-900">{a.clienteName}</p>
                      <p className="text-xs text-ink-500">{a.clientePhone}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-ink-700">
                      {formatDateTime(a.dateTime)}
                    </td>
                    <td className="max-w-xs px-5 py-4 text-ink-600">
                      {a.services?.map((s) => s.name).join(', ') || '—'}
                    </td>
                    <td className="px-5 py-4 capitalize text-ink-600">{a.visitType || 'misto'}</td>
                    <td className="px-5 py-4">
                      <select
                        value={staffIdOf(a)}
                        disabled={updatingId === a._id}
                        onChange={(e) => handleStaffChange(a._id, e.target.value)}
                        className="w-full min-w-[11rem] rounded-full border-0 bg-nude-50 px-3 py-1.5 text-xs font-medium text-ink-800 ring-1 ring-brand-100 focus:outline-none focus:ring-2 focus:ring-dourado-400 disabled:opacity-60"
                      >
                        <option value="">Encarregar profissional…</option>
                        {staff.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.name} · {m.role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-bold text-brand-600">
                      {formatMt(total)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadgeSelect
                        value={a.status}
                        disabled={updatingId === a._id}
                        onChange={(status) => handleStatusChange(a._id, status)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
