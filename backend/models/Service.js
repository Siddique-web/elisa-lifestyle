const mongoose = require('mongoose');

const SERVICE_CATEGORIES = [
  'cabelo_tratamentos',
  'estetica_cuidados',
  'barbearia',
  'pacote_promocional',
  'boutique',
];

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: SERVICE_CATEGORIES,
    },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    includedItems: [{ type: String }],
    promoValidFrom: { type: Date },
    promoValidUntil: { type: Date },
    imageUrl: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
module.exports.SERVICE_CATEGORIES = SERVICE_CATEGORIES;
