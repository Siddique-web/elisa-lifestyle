const mongoose = require('mongoose');

/**
 * Modelo de Serviço/Produto do catálogo.
 * Cobre Cabelo & Tratamentos, Estética & Cuidados, Pacotes Promocionais
 * e itens de Boutique.
 */
const ServicoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      required: true,
      enum: [
        'cabelo_tratamentos',
        'estetica_cuidados',
        'pacote_promocional',
        'boutique',
      ],
    },
    descricao: {
      type: String,
      trim: true,
    },
    preco: {
      type: Number,
      required: true,
      min: 0,
    },
    // Usado apenas em pacotes promocionais (ex: "Pacote Finalistas")
    itensIncluidos: [
      {
        type: String,
      },
    ],
    // Janela de validade do pacote promocional (opcional)
    promocaoValidaDe: { type: Date },
    promocaoValidaAte: { type: Date },
    imagemUrl: { type: String },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Servico', ServicoSchema);
