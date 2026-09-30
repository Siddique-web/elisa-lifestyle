export const CATEGORIAS = [
  {
    chave: 'cabelo_tratamentos',
    titulo: 'Cabelo & Tratamentos Capilares',
    subtitulo: 'Cabelo',
    descricao: 'Lavagens, tranças, penteados e tratamentos capilares.',
    icon: 'scissors',
    anchor: 'servicos',
  },
  {
    chave: 'estetica_cuidados',
    titulo: 'Spa & Estética Avançada',
    subtitulo: 'Spa',
    descricao: 'Manicure, massagens, facial e estética avançada.',
    icon: 'flower',
    anchor: 'servicos',
  },
  {
    chave: 'barbearia',
    titulo: 'Barbearia',
    subtitulo: 'Barbearia',
    descricao: 'Cortes e tratamentos masculinos especializados.',
    icon: 'crown',
    anchor: 'servicos',
  },
  {
    chave: 'pacote_promocional',
    titulo: 'Pacotes Promocionais',
    subtitulo: 'Pacotes',
    descricao: 'Combinações com preço especial para ocasiões.',
    icon: 'percent',
    anchor: 'pacotes',
  },
  {
    chave: 'boutique',
    titulo: 'Boutique (Moda & Acessórios)',
    subtitulo: 'Boutique',
    descricao: 'Roupas, calçados, malas e perfumes.',
    icon: 'bag',
    anchor: 'boutique',
  },
];

export const LABEL_CATEGORIA = Object.fromEntries(
  CATEGORIAS.map((c) => [c.chave, c.titulo])
);
