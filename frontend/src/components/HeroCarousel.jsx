import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { scrollToSection } from '../lib/scrollToSection';

const INTERVALO_MS = 5000;
const VISIVEIS = 3; // quantos cartões de cada lado existem no DOM (o último é só para a transição)

// Posição de cada cartão conforme a distância ao cartão central.
// x = deslocamento horizontal (em múltiplos da largura do cartão central)
const POSICOES = {
  0: { x: 0, scale: 1, opacity: 1 },
  1: { x: 0.82, scale: 0.8, opacity: 1 },
  2: { x: 1.42, scale: 0.62, opacity: 0.85 },
  3: { x: 1.85, scale: 0.5, opacity: 0 },
};

/** Distância circular de i até ao slide atual (ex.: -2, -1, 0, 1, 2). */
function distancia(i, atual, n) {
  let d = (i - atual) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

export default function HeroCarousel({ slides }) {
  const n = slides.length;
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const toqueX = useRef(null);

  const ir = useCallback((i) => setAtual(((i % n) + n) % n), [n]);
  const proximo = useCallback(() => setAtual((i) => (i + 1) % n), [n]);
  const anterior = useCallback(() => setAtual((i) => (i - 1 + n) % n), [n]);

  // Avança sozinho a cada 5s (reinicia a contagem sempre que o slide muda).
  useEffect(() => {
    if (pausado || n < 2) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setTimeout(proximo, INTERVALO_MS);
    return () => clearTimeout(t);
  }, [atual, pausado, n, proximo]);

  if (n === 0) return null;

  const aoTocar = (e) => {
    toqueX.current = e.touches[0].clientX;
  };
  const aoSoltar = (e) => {
    if (toqueX.current === null) return;
    const delta = e.changedTouches[0].clientX - toqueX.current;
    toqueX.current = null;
    if (Math.abs(delta) > 40) (delta < 0 ? proximo : anterior)();
  };
  const aoTeclar = (e) => {
    if (e.key === 'ArrowRight') proximo();
    if (e.key === 'ArrowLeft') anterior();
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-hero-glow pb-16 pt-16 sm:pb-20"
      aria-label="Elisa Lifestyle — cabeleireiro, boutique e spa"
    >
      <div className="hero-enter-text mx-auto flex max-w-3xl flex-col items-center px-4 pb-8 pt-10 text-center sm:px-6 lg:pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          Beira · Moçambique
        </p>
        <h1 className="font-display mt-3 text-[1.85rem] font-semibold leading-snug text-ink-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.18]">
          Sinta o luxo de cuidar de si na{' '}
          <span className="text-brand-600">Elisa Lifestyle</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-500">
          Salão, boutique e spa — tranças, estética e moda num só lugar, com conforto e
          elegância no coração da Beira.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => scrollToSection('servicos')} className="btn-primary">
            Ver serviços →
          </button>
          <button type="button" onClick={() => scrollToSection('espaco')} className="btn-secondary">
            Ver o salão
          </button>
        </div>
      </div>

      <div className="hero-enter-media relative">
        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Fotos do salão e dos trabalhos"
          tabIndex={0}
          onKeyDown={aoTeclar}
          onTouchStart={aoTocar}
          onTouchEnd={aoSoltar}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setPausado(true)}
          onPointerLeave={() => setPausado(false)}
          onFocus={() => setPausado(true)}
          onBlur={() => setPausado(false)}
          className="relative mx-auto w-full touch-pan-y overflow-x-clip outline-none [--card-w:min(68vw,280px)] sm:[--card-w:300px] lg:[--card-w:340px]"
          style={{ height: 'calc(var(--card-w) * 1.25 + 2.5rem)' }}
        >
          {slides.map((s, i) => {
            const d = distancia(i, atual, n);
            const abs = Math.abs(d);
            if (abs > VISIVEIS) return null;
            const p = POSICOES[abs];
            const lado = d < 0 ? -1 : 1;
            const ativo = d === 0;

            return (
              <figure
                key={s.src}
                aria-hidden={!ativo}
                className="absolute left-1/2 top-1/2 m-0 aspect-[4/5] overflow-hidden rounded-3xl bg-nude-100 shadow-glow-lg ring-1 ring-white/60 transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none"
                style={{
                  width: 'var(--card-w)',
                  zIndex: 10 - abs,
                  opacity: p.opacity,
                  pointerEvents: abs === VISIVEIS ? 'none' : 'auto',
                  transform: `translate(-50%, -50%) translateX(calc(var(--card-w) * ${
                    lado * p.x
                  })) scale(${p.scale})`,
                }}
              >
                <img
                  src={s.src}
                  alt={ativo ? s.alt : ''}
                  decoding="async"
                  loading={abs <= 1 ? 'eager' : 'lazy'}
                  fetchPriority={ativo ? 'high' : 'low'}
                  sizes="(max-width: 1024px) 68vw, 340px"
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none object-cover object-[center_18%]"
                />

                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent px-4 pb-4 pt-16 transition-opacity duration-700 ${
                    ativo ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                    Destaque do salão
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white">
                    {s.alt || 'Elisa Lifestyle'}
                  </p>
                </div>

                {!ativo && (
                  <button
                    type="button"
                    onClick={() => ir(i)}
                    aria-label={`Ver foto ${i + 1}: ${s.alt}`}
                    className="absolute inset-0 z-20 cursor-pointer"
                  />
                )}
              </figure>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={anterior}
            aria-label="Foto anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/70 bg-white/60 text-primary transition hover:bg-white active:scale-95"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <span className="min-w-[3.5rem] text-center text-xs font-medium tabular-nums text-ink-500">
            {atual + 1} / {n}
          </span>
          <button
            type="button"
            onClick={proximo}
            aria-label="Próxima foto"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/70 bg-white/60 text-primary transition hover:bg-white active:scale-95"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}