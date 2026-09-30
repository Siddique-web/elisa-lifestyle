import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';
import { WEEK_DAYS, formatDateTime } from '../constants';

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function dayIndexFromDate(date) {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function hourLabel(date) {
  const h = date.getHours();
  return `${String(h).padStart(2, '0')}:00`;
}

export default function StaffScheduleMatrix() {
  const [staff, setStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [staffData, apptData] = await Promise.all([
        api.getStaff(),
        api.getAppointments(),
      ]);
      setStaff(staffData);
      setAppointments(apptData);
      setError('');
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
    const refresh = () => load();
    socket.on('new-appointment', refresh);
    socket.on('status-updated', refresh);
    socket.on('staff-assigned', refresh);
    return () => {
      socket.off('new-appointment', refresh);
      socket.off('status-updated', refresh);
      socket.off('staff-assigned', refresh);
    };
  }, [load]);

  const allocationMap = useMemo(() => {
    const map = new Map();
    appointments.forEach((a) => {
      if (!a.staffMember?._id) return;
      const dt = new Date(a.dateTime);
      const key = `${a.staffMember._id}|${WEEK_DAYS[dayIndexFromDate(dt)]}|${hourLabel(dt)}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(a);
    });
    return map;
  }, [appointments]);

  const isAvailable = (member, day, hour) => {
    const slot = member.schedule?.find((s) => s.day === day && s.available !== false);
    if (!slot) return false;
    return hour >= slot.start && hour < slot.end;
  };

  if (loading) {
    return (
      <p className="glow-card p-8 text-center text-ink-500">
        A carregar agenda da equipa...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      )}

      <div className="glow-card overflow-hidden">
        <div className="border-b border-brand-100 px-5 py-4">
          <h2 className="text-lg font-bold text-ink-900">Disponibilidade semanal</h2>
          <p className="text-sm text-ink-500">
            Rosa claro = disponível · Destaque = cliente alocado
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-brand-50/80 text-ink-500">
                <th className="sticky left-0 z-10 bg-brand-50 px-4 py-2 text-left">Profissional</th>
                {WEEK_DAYS.map((day) => (
                  <th key={day} className="px-2 py-2 text-center font-medium">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Registe profissionais via API /api/staff para visualizar a matriz.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member._id}>
                    <td className="sticky left-0 z-10 bg-white px-4 py-3">
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-slate-500">{member.role}</p>
                    </td>
                    {WEEK_DAYS.map((day) => {
                      const daySlots =
                        member.schedule?.filter((s) => s.day === day && s.available !== false) ||
                        [];
                      return (
                        <td key={day} className="align-top px-2 py-2">
                          {daySlots.length === 0 ? (
                            <span className="block rounded-md bg-slate-100 px-2 py-3 text-center text-slate-400">
                              —
                            </span>
                          ) : (
                            <div className="space-y-1">
                              {daySlots.map((slot) => (
                                <div
                                  key={`${slot.start}-${slot.end}`}
                                  className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-900 ring-1 ring-emerald-100"
                                >
                                  {slot.start}–{slot.end}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glow-card overflow-hidden">
        <div className="border-b border-brand-100 px-5 py-4">
          <h2 className="text-lg font-bold text-ink-900">Alocação por horário</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-slate-200 bg-slate-50 px-2 py-2 text-left">Profissional</th>
                {HOURS.map((h) => (
                  <th key={h} className="border border-slate-200 bg-slate-50 px-2 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member._id}>
                  <td className="border border-slate-200 px-2 py-2 font-medium">{member.name}</td>
                  {HOURS.map((hour) => {
                    const booked = WEEK_DAYS.some((day) => {
                      const key = `${member._id}|${day}|${hour}`;
                      return allocationMap.has(key);
                    });
                    const available = WEEK_DAYS.some((day) => isAvailable(member, day, hour));
                    let cellClass = 'bg-slate-50 text-slate-400';
                    if (booked) cellClass = 'bg-brand-100 text-brand-800 font-semibold';
                    else if (available) cellClass = 'bg-brand-50 text-brand-700';

                    const appts = WEEK_DAYS.flatMap((day) => {
                      const key = `${member._id}|${day}|${hour}`;
                      return allocationMap.get(key) || [];
                    });

                    return (
                      <td
                        key={hour}
                        className={`border border-slate-200 px-1 py-2 text-center ${cellClass}`}
                        title={appts.map((a) => `${a.clienteName} · ${formatDateTime(a.dateTime)}`).join('\n')}
                      >
                        {appts.length > 0 ? appts.length : available ? '·' : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
