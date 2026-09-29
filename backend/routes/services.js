const express = require('express');
const Service = require('../models/Service');
const { serviceToLegacy } = require('../utils/serviceLegacy');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== 'false') filter.active = true;
    if (req.query.categoria) filter.category = req.query.categoria;
    if (req.query.category) filter.category = req.query.category;

    const services = await Service.find(filter).sort({ category: 1, name: 1 });

    if (req.query.legacy === 'true' || req.query.categoria) {
      return res.json(services.map(serviceToLegacy));
    }

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar serviços.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ erro: 'Serviço não encontrado.' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar serviço.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Erro ao criar serviço.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ erro: 'Serviço não encontrado.' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Erro ao atualizar serviço.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!service) return res.status(404).json({ erro: 'Serviço não encontrado.' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao desactivar serviço.' });
  }
});

module.exports = router;
