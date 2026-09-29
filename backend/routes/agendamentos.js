const express = require('express');
const router = express.Router();

const { enviarNotificacaoAgendamento } = require('../config/mailer');
const {
  buildServicesFromBody,
  combineDateAndTime,
} = require('../utils/appointmentHelpers');
const appointmentStore = require('../store/appointmentStore');

/**
 * POST /api/agendamentos — compatível com o site público; persiste em Appointment.
 */
router.post('/', async (req, res) => {
  try {
    const { cliente, servicoIds, data, horario, observacoes, visitType } = req.body;

    if (!cliente || !cliente.nome || !cliente.telefone) {
      return res.status(400).json({
        erro: 'Nome e telefone do cliente são obrigatórios.',
      });
    }
    if (!data || !horario) {
      return res.status(400).json({
        erro: 'Data e horário do agendamento são obrigatórios.',
      });
    }

    const services = await buildServicesFromBody({ serviceIds: servicoIds, services: req.body.servicos });
    const dateTime = combineDateAndTime(data, horario);
    const valorTotal = services.reduce((total, s) => total + s.price, 0);

    const appointment = await appointmentStore.create({
      clienteName: cliente.nome,
      clientePhone: cliente.telefone,
      clienteEmail: cliente.email,
      services,
      dateTime,
      visitType: visitType || 'misto',
      observacoes,
    });

    const populated = appointment;

    const io = req.app.get('io');
    if (io) io.emit('new-appointment', populated);

    const dataFormatada = dateTime.toLocaleDateString('pt-MZ');
    try {
      await enviarNotificacaoAgendamento({
        cliente: { nome: cliente.nome, telefone: cliente.telefone, email: cliente.email },
        servicos: services.map((s) => ({ nome: s.name, preco: s.price })),
        valorTotal,
        data: dataFormatada,
        horario,
      });
    } catch (erroEmail) {
      console.error('Falha ao enviar e-mail de notificação:', erroEmail);
    }

    return res.status(201).json({
      mensagem: 'Agendamento realizado com sucesso!',
      agendamento: {
        id: appointment._id,
        cliente: cliente.nome,
        servicos: services.map((s) => ({ nome: s.name, preco: s.price })),
        valorTotal,
        data: dataFormatada,
        horario,
        status: appointment.status,
      },
    });
  } catch (erro) {
    console.error('Erro ao processar agendamento:', erro);
    const message =
      erro.message && !String(erro.message).includes('Cast')
        ? erro.message
        : 'Ocorreu um erro ao processar o agendamento. Tente novamente.';
    return res.status(400).json({ erro: message });
  }
});

module.exports = router;
