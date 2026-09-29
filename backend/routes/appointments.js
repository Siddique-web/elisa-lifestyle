const express = require('express');
const { APPOINTMENT_STATUSES } = require('../models/Appointment');
const appointmentStore = require('../store/appointmentStore');
const {
  buildServicesFromBody,
  combineDateAndTime,
} = require('../utils/appointmentHelpers');

const router = express.Router();

function getIo(req) {
  return req.app.get('io');
}

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from || req.query.to) {
      if (req.query.from) filter.from = new Date(req.query.from);
      if (req.query.to) filter.to = new Date(req.query.to);
    }

    const appointments = await appointmentStore.list(filter);
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar agendamentos.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const appointment = await appointmentStore.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ erro: 'Agendamento não encontrado.' });
    }
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar agendamento.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      clienteName,
      clientePhone,
      clienteEmail,
      serviceIds,
      services,
      staffMember,
      visitType,
      dateTime,
      data,
      horario,
      observacoes,
    } = req.body;

    if (!clienteName || !clientePhone) {
      return res.status(400).json({ erro: 'Nome e telefone do cliente são obrigatórios.' });
    }

    let resolvedDateTime = dateTime ? new Date(dateTime) : null;
    if (!resolvedDateTime && data && horario) {
      resolvedDateTime = combineDateAndTime(data, horario);
    }
    if (!resolvedDateTime || Number.isNaN(resolvedDateTime.getTime())) {
      return res.status(400).json({ erro: 'Data e horário válidos são obrigatórios.' });
    }

    const resolvedServices = await buildServicesFromBody({ serviceIds, services });

    const appointment = await appointmentStore.create({
      clienteName,
      clientePhone,
      clienteEmail,
      services: resolvedServices,
      staffMember: staffMember || undefined,
      visitType: visitType || 'misto',
      dateTime: resolvedDateTime,
      observacoes,
    });

    const io = getIo(req);
    if (io) io.emit('new-appointment', appointment);

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    const message =
      err.message && !err.message.includes('Cast')
        ? err.message
        : 'Erro ao criar agendamento.';
    res.status(400).json({ erro: message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.serviceIds || updates.services) {
      updates.services = await buildServicesFromBody({
        serviceIds: updates.serviceIds,
        services: updates.services,
      });
      delete updates.serviceIds;
    }
    if (updates.dateTime) updates.dateTime = new Date(updates.dateTime);

    const appointment = await appointmentStore.update(req.params.id, updates);

    if (!appointment) {
      return res.status(404).json({ erro: 'Agendamento não encontrado.' });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Erro ao atualizar agendamento.' });
  }
});

router.patch('/:id/staff', async (req, res) => {
  try {
    const staffMember = req.body.staffMember || null;
    const appointment = await appointmentStore.assignStaff(req.params.id, staffMember);

    if (!appointment) {
      return res.status(404).json({ erro: 'Agendamento não encontrado.' });
    }

    const io = getIo(req);
    if (io) io.emit('staff-assigned', appointment);

    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Erro ao atribuir profissional.' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!APPOINTMENT_STATUSES.includes(status)) {
      return res.status(400).json({
        erro: `Status inválido. Use: ${APPOINTMENT_STATUSES.join(', ')}`,
      });
    }

    const appointment = await appointmentStore.updateStatus(req.params.id, status);

    if (!appointment) {
      return res.status(404).json({ erro: 'Agendamento não encontrado.' });
    }

    const io = getIo(req);
    if (io) io.emit('status-updated', appointment);

    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Erro ao atualizar status.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await appointmentStore.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ erro: 'Agendamento não encontrado.' });
    }
    res.json({ mensagem: 'Agendamento removido.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover agendamento.' });
  }
});

module.exports = router;
