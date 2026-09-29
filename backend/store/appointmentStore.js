const Appointment = require('../models/Appointment');
const { isMongoReady } = require('../db/connection');
const memory = require('./memoryStore');

async function list(filter = {}) {
  if (isMongoReady()) {
    const query = {};
    if (filter.status) query.status = filter.status;
    if (filter.from || filter.to) {
      query.dateTime = {};
      if (filter.from) query.dateTime.$gte = filter.from;
      if (filter.to) query.dateTime.$lte = filter.to;
    }
    return Appointment.find(query)
      .populate('staffMember', 'name role')
      .sort({ dateTime: 1 })
      .lean();
  }

  return memory.listAppointments(filter);
}

async function findById(id) {
  if (isMongoReady()) {
    return Appointment.findById(id).populate('staffMember', 'name role');
  }
  return memory.findAppointmentById(id);
}

async function create(data) {
  if (isMongoReady()) {
    const appointment = await Appointment.create(data);
    return Appointment.findById(appointment._id).populate('staffMember', 'name role');
  }
  return memory.createAppointment(data);
}

async function updateStatus(id, status) {
  if (isMongoReady()) {
    return Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('staffMember', 'name role');
  }
  return memory.updateAppointmentStatus(id, status);
}

async function update(id, updates) {
  if (isMongoReady()) {
    return Appointment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('staffMember', 'name role');
  }
  return memory.updateAppointment(id, updates);
}

async function assignStaff(id, staffMemberId) {
  const value = staffMemberId || null;
  if (isMongoReady()) {
    return Appointment.findByIdAndUpdate(
      id,
      { staffMember: value },
      { new: true, runValidators: true }
    ).populate('staffMember', 'name role');
  }
  return memory.assignStaff(id, value);
}

async function remove(id) {
  if (isMongoReady()) {
    return Appointment.findByIdAndDelete(id);
  }
  return memory.deleteAppointment(id);
}

async function listInRange(from, to, { excludeCancelled = false } = {}) {
  const items = await list({ from, to });
  if (!excludeCancelled) return items;
  return items.filter((a) => a.status !== 'Cancelado');
}

module.exports = {
  list,
  findById,
  create,
  updateStatus,
  update,
  assignStaff,
  remove,
  listInRange,
};
