import { Link } from 'react-router-dom';
import { scrollToSection } from '../lib/scrollToSection';

export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-4xl bg-promo-glow p-8 shadow-glow-lg sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div className="hero-accent -left-24 top-0 h-56 w-56 opacity-30" aria-hidden />
        <div className="relative max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/90">
            Pacotes & promoções
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Até 30% em pacotes de beleza selecionados
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/90">
            Combine cabelo, estética e spa num só agendamento — ideal para eventos na Beira.
          </p>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-3 lg:mt-0">
          <button
            type="button"
            onClick={() => scrollToSection('pacotes')}
            className="btn-secondary !border-white/50 !bg-white !text-brand-700 hover:!bg-brand-50"
          >
            Ver pacotes
          </button>
          <Link
            to="/admin"
            className="rounded-full bg-white/15 px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-white/35 backdrop-blur transition hover:bg-white/25"
          >
            Painel admin →
          </Link>
        </div>
      </div>
    </section>
  );
}
