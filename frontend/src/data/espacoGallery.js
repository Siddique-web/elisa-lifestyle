/** Fotos reais do salão Elisa Lifestyle (public/images/espaco). */
export const FOTOS_ESPACO = [
  {
    imagem: '/images/espaco/01-pedicure-neon.png',
    alt: 'Estação de pedicure com neon "getting my glow on" — Elisa Lifestyle',
    titulo: 'Spa & pedicure',
    texto: 'Poltronas premium, detalhes em ouro e ambiente acolhedor para o seu momento de glow.',
    focal: 'object-cover object-[center_42%]',
  },
  {
    imagem: '/images/espaco/02-pedicure-panoramica.png',
    alt: 'Vista panorâmica da zona de pedicure',
    titulo: 'Zona de relaxamento',
    texto: 'Espaço amplo, iluminação suave e design contemporâneo no coração da Beira.',
    focal: 'object-center',
  },
  {
    imagem: '/images/espaco/03-pedicure-lateral.png',
    alt: 'Detalhe das cadeiras e bancadas de pedicure',
    titulo: 'Conforto & elegância',
    texto: 'Madeira nobre, branco imaculado e acabamentos que transmitem luxo discreto.',
    focal: 'object-[center_40%]',
  },
  {
    imagem: '/images/espaco/04-salon-completo.png',
    alt: 'Salão completo com manicure, cabelo e área de espera',
    titulo: 'Salão completo',
    texto: 'Manicure, cabelo, produtos e lounge — tudo num só lugar.',
    focal: 'object-center',
  },
  {
    imagem: '/images/espaco/05-manicure-premium.png',
    alt: 'Estação de manicure Elisa Lifestyle',
    titulo: 'Manicure premium',
    texto: 'Mesas em mármore, cadeiras capitoné e branding bordado em cada detalhe.',
    focal: 'object-center',
  },
  {
    imagem: '/images/espaco/06-lavagem-cabelo.png',
    alt: 'Estação de lavagem e tratamento capilar',
    titulo: 'Cabelo & tratamentos',
    texto: 'Lavagem profissional com produtos de alta performance e experiência VIP.',
    focal: 'object-center',
  },
  {
    imagem: '/images/espaco/07-equipa.png',
    alt: 'Equipa Elisa Lifestyle no salão',
    titulo: 'A nossa equipa',
    texto: 'Profissionais dedicados a realçar a sua beleza com carinho e excelência.',
    focal: 'object-cover object-[center_22%]',
  },
];

export const FOTOS_TRABALHOS = [
  {
    src: '/images/trabalhos/01-trabalho.png',
    alt: 'Penteado com caracóis laterais e maquilhagem',
  },
  {
    src: '/images/trabalhos/02-trabalho.png',
    alt: 'Coque infantil com tiara',
  },
  {
    src: '/images/trabalhos/03-trabalho.png',
    alt: 'Rabo de cavalo com tranças laterais e makeup de festa',
  },
  {
    src: '/images/trabalhos/04-trabalho.png',
    alt: 'Tranças box braids com ombré',
  },
  {
    src: '/images/trabalhos/05-trabalho.png',
    alt: 'Ondas suaves com lace — atendimento no salão',
  },
  {
    src: '/images/trabalhos/06-trabalho.png',
    alt: 'Meia presa com caracóis e maquilhagem',
  },
  {
    src: '/images/trabalhos/07-trabalho.png',
    alt: 'Tranças coladas com acessórios dourados',
  },
  {
    src: '/images/trabalhos/08-trabalho.png',
    alt: 'Knotless braids com ondas',
  },
  {
    src: '/images/trabalhos/09-trabalho.png',
    alt: 'Penteados infantis com tranças e detalhes em rosa',
  },
  {
    src: '/images/trabalhos/10-trabalho.png',
    alt: 'Cornrows com extensão encaracolada',
  },
];

/** Hero: espaço + todos os trabalhos, 5s por imagem */
export const HERO_ESPACO_SLIDES = [
  { src: FOTOS_ESPACO[5].imagem, alt: FOTOS_ESPACO[5].alt },
  { src: FOTOS_ESPACO[0].imagem, alt: FOTOS_ESPACO[0].alt },
  { src: FOTOS_ESPACO[3].imagem, alt: FOTOS_ESPACO[3].alt },
  ...FOTOS_TRABALHOS,
];
