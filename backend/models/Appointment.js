const mongoose = require('mongoose');

const APPOINTMENT_STATUSES = [
  'Pendente',
  'Confirmado',
  'Adiado',
  'Concluído',
  'Cancelado',
];

const VISIT_TYPES = ['salao', 'spa', 'boutique', 'misto'];

const selectedServiceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    clienteName: { type: String, required: true, trim: true },
    clientePhone: { type: String, required: true, trim: true },
    clienteEmail: { type: String, trim: true, lowercase: true },
    services: {
      type: [selectedServiceSchema],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'Ao menos um serviço é obrigatório'],
    },
    staffMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    visitType: {
      type: String,
      enum: VISIT_TYPES,
      default: 'misto',
    },
    dateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: 'Pendente',
    },
    observacoes: { type: String, trim: true },
  },
  { timestamps: true }
);

appointmentSchema.virtual('totalValue').get(function totalValue() {
  return this.services.reduce((sum, s) => sum + s.price, 0);
});

appointmentSchema.set('toJSON', { virtuals: true });
appointmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
module.exports.APPOINTMENT_STATUSES = APPOINTMENT_STATUSES;
module.exports.VISIT_TYPES = VISIT_TYPES;
