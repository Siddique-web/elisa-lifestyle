const express = require('express');
const Staff = require('../models/Staff');
const { isMongoReady } = require('../db/connection');
const memory = require('../store/memoryStore');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!isMongoReady()) {
      return res.json(memory.listStaff({ activeOnly: req.query.active !== 'false' }));
    }

    const filter = {};
    if (req.query.active !== 'false') filter.active = true;
    const staff = await Staff.find(filter).sort({ name: 1 });
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar equipa.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isMongoReady()) {
      const member = memory.findStaffById(req.params.id);
      if (!member) return res.status(404).json({ erro: 'Profissional não encontrado.' });
      return res.json(member);
    }

    const member = await Staff.findById(req.params.id);
    if (!member) return res.status(404).json({ erro: 'Profissional não encontrado.' });
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar profissional.' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!isMongoReady()) {
      return res.status(201).json(memory.createStaff(req.body));
    }
    const member = await Staff.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Erro ao criar membro da equipa.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isMongoReady()) {
      const member = memory.updateStaff(req.params.id, req.body);
      if (!member) return res.status(404).json({ erro: 'Profissional não encontrado.' });
      return res.json(member);
    }
    const member = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ erro: 'Profissional não encontrado.' });
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Erro ao atualizar profissional.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isMongoReady()) {
      const member = memory.updateStaff(req.params.id, { active: false });
      if (!member) return res.status(404).json({ erro: 'Profissional não encontrado.' });
      return res.json(member);
    }
    const member = await Staff.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!member) return res.status(404).json({ erro: 'Profissional não encontrado.' });
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao desactivar profissional.' });
  }
});

module.exports = router;
