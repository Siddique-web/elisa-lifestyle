/** Mapeia Service (admin) para o formato legado do catálogo público. */
function serviceToLegacy(doc) {
  const s = doc.toObject ? doc.toObject() : doc;
  return {
    _id: s._id,
    nome: s.name,
    categoria: s.category,
    descricao: s.description,
    preco: s.price,
    itensIncluidos: s.includedItems || [],
    promocaoValidaDe: s.promoValidFrom,
    promocaoValidaAte: s.promoValidUntil,
    imagemUrl: s.imageUrl,
    ativo: s.active,
  };
}

module.exports = { serviceToLegacy };
