const { catalogServices } = require('../data/catalogServices');

function toLegacy(item) {
  return {
    _id: item.slug,
    slug: item.slug,
    nome: item.name,
    categoria: item.category,
    descricao: item.description,
    preco: item.price,
    itensIncluidos: item.includedItems || [],
    ativo: true,
  };
}

function getLegacyCatalog() {
  return catalogServices.map(toLegacy);
}

function findBySlugOrId(id) {
  const key = String(id);
  return catalogServices.find((s) => s.slug === key || String(s._id) === key);
}

function resolveServicesFromIds(serviceIds) {
  if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
    throw new Error('Selecione ao menos um serviço.');
  }

  const resolved = serviceIds.map((id) => {
    const item = findBySlugOrId(id);
    if (!item) {
      throw new Error(`Serviço não encontrado: ${id}`);
    }
    return {
      service: item.slug,
      name: item.name,
      price: item.price,
    };
  });

  return resolved;
}

function normalizeInlineServices(services) {
  if (!Array.isArray(services) || services.length === 0) {
    throw new Error('Selecione ao menos um serviço.');
  }

  return services.map((s) => {
    const name = s.name || s.nome;
    const price = Number(s.price ?? s.preco);
    if (!name || Number.isNaN(price)) {
      throw new Error('Serviço inválido na lista.');
    }
    return {
      service: s.slug || s._id || undefined,
      name,
      price,
    };
  });
}

module.exports = {
  catalogServices,
  getLegacyCatalog,
  findBySlugOrId,
  resolveServicesFromIds,
  normalizeInlineServices,
  toLegacy,
};
