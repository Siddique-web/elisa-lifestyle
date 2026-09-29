function formatDay(date) {
  return date.toISOString().slice(0, 10);
}

function formatMonth(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function periodKey(dateTime, groupBy) {
  const date = new Date(dateTime);
  if (groupBy === 'month') return formatMonth(date);
  if (groupBy === 'week') return formatWeek(date);
  return formatDay(date);
}

function revenueOf(appointment) {
  return (appointment.services || []).reduce((sum, s) => sum + (s.price || 0), 0);
}

function volumeSeries(appointments, groupBy) {
  const map = new Map();

  appointments.forEach((a) => {
    const key = periodKey(a.dateTime, groupBy);
    const row = map.get(key) || { period: key, appointments: 0, revenue: 0 };
    row.appointments += 1;
    row.revenue += revenueOf(a);
    map.set(key, row);
  });

  return [...map.values()].sort((a, b) => a.period.localeCompare(b.period));
}

function statusSummary(appointments) {
  const map = new Map();
  appointments.forEach((a) => {
    map.set(a.status, (map.get(a.status) || 0) + 1);
  });
  return [...map.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

function dailyHistorical(appointments) {
  const map = new Map();
  appointments
    .filter((a) => ['Confirmado', 'Concluído', 'Pendente'].includes(a.status))
    .forEach((a) => {
      const key = formatDay(new Date(a.dateTime));
      map.set(key, (map.get(key) || 0) + 1);
    });

  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([period, count]) => ({ _id: period, count }));
}

function peakHours(appointments) {
  const map = new Map();
  appointments
    .filter((a) => a.status !== 'Cancelado')
    .forEach((a) => {
      const hour = new Date(a.dateTime).getHours();
      map.set(hour, (map.get(hour) || 0) + 1);
    });

  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([hour, count]) => ({ _id: hour, count }));
}

module.exports = {
  volumeSeries,
  statusSummary,
  dailyHistorical,
  peakHours,
  revenueOf,
};
