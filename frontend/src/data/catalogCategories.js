export const CATEGORIAS = [
  {
    chave: 'cabelo_tratamentos',
    titulo: 'Cabelo & Tratamentos Capilares',
    icon: 'scissors',
    anchor: 'servicos',
  },
  {
    chave: 'estetica_cuidados',
    titulo: 'Spa & Estética Avançada',
    icon: 'flower',
    anchor: 'servicos',
  },
  {
    chave: 'barbearia',
    titulo: 'Barbearia',
    icon: 'crown',
    anchor: 'servicos',
  },
  {
    chave: 'pacote_promocional',
    titulo: 'Pacotes Promocionais',
    icon: 'percent',
    anchor: 'pacotes',
  },
  {
    chave: 'boutique',
    titulo: 'Boutique (Moda & Acessórios)',
    icon: 'bag',
    anchor: 'boutique',
  },
];

export const LABEL_CATEGORIA = Object.fromEntries(
  CATEGORIAS.map((c) => [c.chave, c.titulo])
);
