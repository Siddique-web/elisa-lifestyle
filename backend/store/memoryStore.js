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

const state = {
  appointments: [],
  staff: [...defaultStaff],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function findStaffById(id) {
  const member = state.staff.find((s) => s._id === id);
  return member ? clone(member) : null;
}

function listStaff({ activeOnly = true } = {}) {
  let list = state.staff;
  if (activeOnly) list = list.filter((s) => s.active !== false);
  return clone(list.sort((a, b) => a.name.localeCompare(b.name)));
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

  return clone(list.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)));
}

function populateStaff(appointment) {
  if (!appointment.staffMember) return appointment;
  const member = findStaffById(appointment.staffMember);
  return {
    ...appointment,
    staffMember: member || appointment.staffMember,
  };
}

function createAppointment(payload) {
  const now = new Date().toISOString();
  const appointment = {
    _id: `mem-${randomUUID()}`,
    ...payload,
    status: payload.status || 'Pendente',
    createdAt: now,
    updatedAt: now,
  };

  state.appointments.unshift(appointment);
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

  return clone(populateStaff(state.appointments[idx]));
}

function updateAppointment(id, updates) {
  const idx = state.appointments.findIndex((a) => a._id === id);
  if (idx === -1) return null;

  const nextUpdates = { ...updates };
  if (Object.prototype.hasOwnProperty.call(nextUpdates, 'staffMember')) {
    const raw = nextUpdates.staffMember;
    nextUpdates.staffMember =
      raw && typeof raw === 'object' ? raw._id || null : raw || null;
  }

  state.appointments[idx] = {
    ...state.appointments[idx],
    ...nextUpdates,
    updatedAt: new Date().toISOString(),
  };

  return clone(populateStaff(state.appointments[idx]));
}

function assignStaff(id, staffMemberId) {
  return updateAppointment(id, { staffMember: staffMemberId || null });
}

function deleteAppointment(id) {
  const idx = state.appointments.findIndex((a) => a._id === id);
  if (idx === -1) return null;
  const [removed] = state.appointments.splice(idx, 1);
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
};
