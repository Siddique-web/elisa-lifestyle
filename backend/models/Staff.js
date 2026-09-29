const mongoose = require('mongoose');

const STAFF_ROLES = [
  'Trancista',
  'Cabeleireiro',
  'Manicure',
  'Maquilhador',
  'Esteticista',
  'Barbeiro',
  'Outro',
];

const WEEK_DAYS = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

const scheduleSlotSchema = new mongoose.Schema(
  {
    day: { type: String, enum: WEEK_DAYS, required: true },
    start: { type: String, required: true }, // HH:mm
    end: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: STAFF_ROLES, required: true },
    schedule: { type: [scheduleSlotSchema], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
module.exports.STAFF_ROLES = STAFF_ROLES;
module.exports.WEEK_DAYS = WEEK_DAYS;
