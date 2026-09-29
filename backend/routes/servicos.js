const express = require('express');
const { getLegacyCatalog } = require('../utils/catalog');

const router = express.Router();

// GET /api/servicos?categoria=cabelo_tratamentos — catálogo público (sem MongoDB)
router.get('/', (req, res) => {
  try {
    let services = getLegacyCatalog();
    if (req.query.categoria) {
      services = services.filter((s) => s.categoria === req.query.categoria);
    }
    res.json(services);
  } catch (erro) {
    console.error('Erro ao listar serviços:', erro);
    res.status(500).json({ erro: 'Erro ao carregar catálogo de serviços.' });
  }
});

module.exports = router;
