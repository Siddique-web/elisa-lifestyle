import { useEffect, useState, useCallback } from 'react';
import { scrollToSection } from '../lib/scrollToSection';

export default function HeroCarousel({ slides }) {
  const [atual, setAtual] = useState(0);

  const proximo = useCallback(() => {
    setAtual((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const intervalo = setInterval(proximo, 5000);
    return () => clearInterval(intervalo);
  }, [proximo]);

  const slide = slides[atual];

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-hero-glow pt-16"
      aria-label="Elisa Lifestyle — cabeleireiro, boutique e spa"
    >
      <div className="relative mx-auto grid max-w-6xl items-start gap-6 px-4 pb-10 pt-3 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:pb-12 lg:pt-4">
        <div className="hero-enter-text order-2 flex flex-col justify-start lg:order-1 lg:pt-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Beira · Moçambique
          </p>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl lg:text-[2.75rem] lg:leading-[1.15]">
            Sinta o luxo de cuidar de si na{' '}
            <span className="text-brand-600">Elisa Lifestyle</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-500">
            Salão, boutique e spa — tranças, estética e moda num só lugar, com conforto
            e elegância no coração da Beira.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollToSection('servicos')} className="btn-primary">
              Ver serviços →
            </button>
            <button type="button" onClick={() => scrollToSection('espaco')} className="btn-secondary">
              Ver o salão
            </button>
          </div>
        </div>

        <div className="hero-enter-media relative order-1 flex flex-col items-center justify-start lg:order-2">
          <div className="hero-accent right-[6%] top-[8%] z-0 hidden h-[88%] w-[76%] lg:block" aria-hidden />
          <div className="relative z-10 w-full max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-3xl bg-white p-1.5 shadow-glow-lg sm:p-2">
              <div className="relative aspect-[4/5] max-h-[min(70vh,520px)] w-full overflow-hidden rounded-[1.15rem] bg-nude-100">
                {slides.map((s, i) => (
                  <img
                    key={`${s.src}-${i}`}
                    src={s.src}
                    alt={s.alt}
                    decoding="async"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 1024px) 92vw, 480px"
                    className={`absolute inset-0 h-full w-full object-cover object-[center_18%] transition-opacity duration-700 ${
                      i === atual ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent px-4 pb-4 pt-16">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                    Destaque do salão
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-white line-clamp-2">
                    {slide?.alt || 'Elisa Lifestyle'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={`${s.src}-${i}`}
                  type="button"
                  onClick={() => setAtual(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === atual ? 'w-7 bg-accent' : 'w-2 bg-secondary hover:bg-accent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
