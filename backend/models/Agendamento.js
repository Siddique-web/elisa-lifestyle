const mongoose = require('mongoose');

/**
 * Um agendamento referencia o cliente e um ou mais serviços escolhidos.
 * O valorTotal é calculado no backend a partir dos preços dos serviços,
 * nunca confiado ao valor enviado pelo cliente.
 */
const AgendamentoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    },
    servicos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servico',
        required: true,
      },
    ],
    valorTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    data: {
      type: Date,
      required: true,
    },
    horario: {
      type: String, // formato "HH:mm"
      required: true,
    },
    status: {
      type: String,
      enum: ['pendente', 'confirmado', 'concluido', 'cancelado'],
      default: 'pendente',
    },
    observacoes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Agendamento', AgendamentoSchema);
