import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { scrollToSection } from '../lib/scrollToSection';
import { FOTOS_ESPACO } from '../data/espacoGallery';

function PainelFoto({ imagem, alt, titulo, texto, focal, index }) {
  return (
    <article className="flex w-full flex-shrink-0 items-center justify-center px-4 py-2 sm:px-6 lg:h-full lg:w-[100vw] lg:max-w-[100vw] lg:px-8 lg:py-0">
      <div className="galeria-slide-frame relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-primary shadow-glow ring-1 ring-black/5">
        <div className="relative h-full min-h-[280px] w-full sm:min-h-[380px]">
          <img
            src={imagem}
            alt={alt}
            decoding="async"
            loading={index <= 1 ? 'eager' : 'lazy'}
            sizes="(max-width: 1024px) 100vw, min(1152px, 92vw)"
            className={`absolute inset-0 h-full w-full object-cover ${focal || 'object-center'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 pt-16 sm:px-10 sm:pb-8 lg:px-12 lg:pb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent sm:text-xs">
              Elisa Lifestyle · Beira
            </p>
            <h3 className="font-display mt-2 text-2xl font-semibold leading-snug text-white sm:text-3xl lg:text-[2rem]">
              {titulo}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
              {texto}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function PainelColecao({ titulo, texto, contagem, anchorId, imagem }) {
  return (
    <article className="collection-card mx-4 flex-shrink-0 sm:mx-6 lg:mx-0 lg:mr-8">
      {imagem && (
        <img
          src={imagem}
          alt=""
          loading="lazy"
          className="pointer-events-none absolute -right-3 bottom-0 h-36 w-36 rounded-2xl object-cover opacity-90 shadow-xl sm:h-44 sm:w-44"
        />
      )}
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">Catálogo</p>
        <h3 className="font-display mt-2 text-2xl font-semibold">{titulo}</h3>
        <p className="mt-2 text-sm text-white/90">{texto}</p>
        <p className="mt-3 text-xl font-bold">{contagem}+ itens</p>
      </div>
      <button
        type="button"
        onClick={() => scrollToSection(anchorId)}
        className="relative z-10 mt-4 w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
      >
        Explorar →
      </button>
    </article>
  );
}

function refreshScrollAfterImages(track) {
  const imgs = track.querySelectorAll('img');
  const waits = [...imgs].map(
    (img) =>
      new Promise((resolve) => {
        if (img.complete) resolve();
        else {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }
      })
  );
  return Promise.all(waits).then(() => ScrollTrigger.refresh());
}

export default function HorizontalGallery({ servicos = [] }) {
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  const count = (cat) => servicos.filter((s) => s.categoria === cat).length;

  const colecoes = [
    {
      titulo: 'Serviços',
      texto: 'Cabelo, tratamentos e estética.',
      contagem:
        count('cabelo_tratamentos') + count('estetica_cuidados') + count('barbearia') || 12,
      anchorId: 'servicos',
      imagem: '/images/espaco/06-lavagem-cabelo.png',
    },
    {
      titulo: 'Boutique',
      texto: 'Moda e acessórios exclusivos.',
      contagem: count('boutique') || 8,
      anchorId: 'boutique',
      imagem: '/images/espaco/04-salon-completo.png',
    },
    {
      titulo: 'Pacotes',
      texto: 'Promoções para ocasiões especiais.',
      contagem: count('pacote_promocional') || 5,
      anchorId: 'pacotes',
      imagem: '/images/espaco/01-pedicure-neon.png',
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const track = trackRef.current;
        const pinEl = pinRef.current;
        if (!track || !pinEl) return undefined;

        const getScrollDistance = () => {
          const distance = track.scrollWidth - window.innerWidth;
          return Math.max(0, Math.round(distance));
        };

        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            id: 'galeria-horizontal',
            trigger: pinEl,
            start: 'top top+=56',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        let resizeTimer;
        const onResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
        };
        window.addEventListener('resize', onResize);

        refreshScrollAfterImages(track);

        return () => {
          window.removeEventListener('resize', onResize);
          clearTimeout(resizeTimer);
          tween.scrollTrigger?.kill();
        };
      });
    }, pinRef);

    return () => ctx.revert();
  }, [servicos.length]);

  return (
    <section
      id="galeria"
      aria-label="Galeria do espaço Elisa Lifestyle"
      className="scroll-mt-20 bg-cream-100 pb-12 lg:pb-0"
    >
      <div id="espaco" className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:pb-8 lg:pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          O nosso espaço
        </p>
        <h2 className="section-title mt-2">Conheça o salão & boutique</h2>
        <p className="section-sub mt-3 max-w-2xl text-left">
          Fotos reais do interior — pedicure, manicure, cabelo e a equipa que o recebe na Beira.
        </p>
      </div>

      <div ref={pinRef} className="galeria-pin-viewport lg:overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col gap-8 pb-4 lg:h-full lg:w-max lg:flex-row lg:flex-nowrap lg:items-stretch lg:gap-0 lg:pb-0"
        >
          {FOTOS_ESPACO.map((p, index) => (
            <PainelFoto key={p.imagem} {...p} index={index} />
          ))}

          <div className="flex w-full flex-shrink-0 flex-col justify-center gap-5 px-4 py-4 lg:h-full lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:pl-8 lg:pr-12">
            <div className="hidden max-w-[220px] shrink-0 lg:block">
              <p className="text-sm font-semibold text-brand-600">Catálogo</p>
              <p className="mt-2 text-sm text-ink-500">
                Continue a rolar para escolher serviços e agendar.
              </p>
            </div>
            {colecoes.map((c) => (
              <PainelColecao key={c.titulo} {...c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
