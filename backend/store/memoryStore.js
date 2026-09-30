const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const APPOINTMENT_STATUSES = [
  'Pendente',
  'Confirmado',
  'Adiado',
  'Concluído',
  'Cancelado',
];

const defaultStaff = [
  {
    _id: 'staff-elisa',
    name: 'Elisa M.',
    role: 'Cabeleireiro',
    active: true,
    schedule: [
      { day: 'Segunda', start: '08:00', end: '17:00', available: true },
      { day: 'Terça', start: '08:00', end: '17:00', available: true },
      { day: 'Quarta', start: '08:00', end: '17:00', available: true },
      { day: 'Quinta', start: '08:00', end: '17:00', available: true },
      { day: 'Sexta', start: '08:00', end: '18:00', available: true },
      { day: 'Sábado', start: '09:00', end: '15:00', available: true },
    ],
  },
  {
    _id: 'staff-ana',
    name: 'Ana T.',
    role: 'Trancista',
    active: true,
    schedule: [
      { day: 'Terça', start: '09:00', end: '18:00', available: true },
      { day: 'Quarta', start: '09:00', end: '18:00', available: true },
      { day: 'Quinta', start: '09:00', end: '18:00', available: true },
      { day: 'Sexta', start: '09:00', end: '18:00', available: true },
      { day: 'Sábado', start: '08:00', end: '16:00', available: true },
    ],
  },
  {
    _id: 'staff-sofia',
    name: 'Sofia L.',
    role: 'Manicure',
    active: true,
    schedule: [
      { day: 'Segunda', start: '10:00', end: '18:00', available: true },
      { day: 'Quarta', start: '10:00', end: '18:00', available: true },
      { day: 'Sexta', start: '10:00', end: '18:00', available: true },
      { day: 'Sábado', start: '09:00', end: '14:00', available: true },
    ],
  },
  {
    _id: 'staff-carlos',
    name: 'Carlos B.',
    role: 'Barbeiro',
    active: true,
    schedule: [
      { day: 'Segunda', start: '09:00', end: '18:00', available: true },
      { day: 'Terça', start: '09:00', end: '18:00', available: true },
      { day: 'Quinta', start: '09:00', end: '18:00', available: true },
      { day: 'Sexta', start: '09:00', end: '19:00', available: true },
      { day: 'Sábado', start: '08:00', end: '15:00', available: true },
    ],
  },
];

const STORE_FILE = path.join(__dirname, '..', 'data', 'local-store.json');

function persist() {
  try {
    const payload = {
      appointments: state.appointments,
      staff: state.staff,
    };
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(payload, null, 0));
  } catch (err) {
    console.warn('Não foi possível gravar dados locais:', err.message);
  }
}

function loadPersisted() {
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const raw = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    if (Array.isArray(raw.appointments)) state.appointments = raw.appointments;
    if (Array.isArray(raw.staff) && raw.staff.length) state.staff = raw.staff;
  } catch (err) {
    console.warn('Não foi possível ler dados locais:', err.message);
  }
}

const state = {
  appointments: [],
  staff: [...defaultStaff],
};

loadPersisted();
if (!fs.existsSync(STORE_FILE)) persist();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toIso(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function staffRef(value) {
  if (!value) return null;
  if (typeof value === 'object') return value._id || null;
  return value;
}

function findStaffById(id) {
  const key = staffRef(id);
  if (!key) return null;
  const member = state.staff.find((s) => s._id === key);
  return member ? clone(member) : null;
}

function listStaff({ activeOnly = true } = {}) {
  let list = state.staff;
  if (activeOnly) list = list.filter((s) => s.active !== false);
  return clone(list.sort((a, b) => a.name.localeCompare(b.name)));
}

function createStaff(payload) {
  const member = {
    _id: `staff-${randomUUID()}`,
    name: payload.name || 'Profissional',
    role: payload.role || 'Equipa',
    active: payload.active !== false,
    schedule: Array.isArray(payload.schedule) ? payload.schedule : [],
  };
  state.staff.push(member);
  persist();
  return clone(member);
}

function updateStaff(id, updates) {
  const idx = state.staff.findIndex((s) => s._id === id);
  if (idx === -1) return null;
  state.staff[idx] = { ...state.staff[idx], ...updates, _id: id };
  persist();
  return clone(state.staff[idx]);
}

function listAppointments(filter = {}) {
  let list = [...state.appointments];

  if (filter.status) {
    list = list.filter((a) => a.status === filter.status);
  }
  if (filter.from || filter.to) {
    list = list.filter((a) => {
      const dt = new Date(a.dateTime);
      if (filter.from && dt < filter.from) return false;
      if (filter.to && dt > filter.to) return false;
      return true;
    });
  }

  return clone(
    list
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
      .map(populateStaff)
  );
}

function populateStaff(appointment) {
  const id = staffRef(appointment.staffMember);
  if (!id) return { ...appointment, staffMember: null };
  const member = findStaffById(id);
  return {
    ...appointment,
    staffMember: member || null,
  };
}

function createAppointment(payload) {
  const now = new Date().toISOString();
  const appointment = {
    _id: `mem-${randomUUID()}`,
    ...payload,
    dateTime: toIso(payload.dateTime) || payload.dateTime,
    staffMember: staffRef(payload.staffMember),
    status: payload.status || 'Pendente',
    createdAt: now,
    updatedAt: now,
  };

  state.appointments.unshift(appointment);
  persist();
  return clone(populateStaff(appointment));
}

function findAppointmentById(id) {
  const item = state.appointments.find((a) => a._id === id);
  return item ? clone(populateStaff(item)) : null;
}

function updateAppointmentStatus(id, status) {
  const idx = state.appointments.findIndex((a) => a._id === id);
  if (idx === -1) return null;

  state.appointments[idx] = {
    ...state.appointments[idx],
    status,
    updatedAt: new Date().toISOString(),
  };

  persist();
  return clone(populateStaff(state.appointments[idx]));
}

function updateAppointment(id, updates) {
  const idx = state.appointments.findIndex((a) => a._id === id);
  if (idx === -1) return null;

  const nextUpdates = { ...updates };
  if (Object.prototype.hasOwnProperty.call(nextUpdates, 'staffMember')) {
    nextUpdates.staffMember = staffRef(nextUpdates.staffMember);
  }
  if (Object.prototype.hasOwnProperty.call(nextUpdates, 'dateTime')) {
    nextUpdates.dateTime = toIso(nextUpdates.dateTime) || nextUpdates.dateTime;
  }

  state.appointments[idx] = {
    ...state.appointments[idx],
    ...nextUpdates,
    updatedAt: new Date().toISOString(),
  };

  persist();
  return clone(populateStaff(state.appointments[idx]));
}

function assignStaff(id, staffMemberId) {
  return updateAppointment(id, { staffMember: staffMemberId || null });
}

function deleteAppointment(id) {
  const idx = state.appointments.findIndex((a) => a._id === id);
  if (idx === -1) return null;
  const [removed] = state.appointments.splice(idx, 1);
  persist();
  return clone(removed);
}

module.exports = {
  APPOINTMENT_STATUSES,
  listAppointments,
  findAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  updateAppointment,
  assignStaff,
  deleteAppointment,
  listStaff,
  findStaffById,
  createStaff,
  updateStaff,
};
