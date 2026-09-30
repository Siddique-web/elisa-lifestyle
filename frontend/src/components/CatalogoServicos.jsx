import { useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CATEGORIAS } from '../data/catalogCategories';
import { downloadQuotePdf } from '../lib/quotePdf';
import { scrollToSection } from '../lib/scrollToSection';
import CategoryIcon from './CategoryIcon';

const formatoMt = (valor) => `${valor.toLocaleString('pt-MZ')} Mt`;

function scrollRow(el, dir) {
  if (!el) return;
  el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.75, 420), behavior: 'smooth' });
}

export default function CatalogoServicos({ servicos, onAgendar }) {
  const [selecionadosIds, setSelecionadosIds] = useState(new Set());
  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIAS[0].chave);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const rowRefs = useRef({});

  const alternar = (id) => {
    setSelecionadosIds((atual) => {
      const novo = new Set(atual);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  };

  const selecionados = useMemo(
    () => servicos.filter((s) => selecionadosIds.has(s._id)),
    [servicos, selecionadosIds]
  );

  const total = useMemo(
    () => selecionados.reduce((soma, s) => soma + s.preco, 0),
    [selecionados]
  );

  const exportarPdf = () => {
    if (selecionados.length === 0) return;
    downloadQuotePdf(selecionados, {
      nome: clienteNome.trim(),
      telefone: clienteTelefone.trim(),
    });
  };

  const irParaCategoria = (chave) => {
    if (!chave) return;
    setCategoriaActiva(chave);
    scrollToSection(`cat-${chave}`);
  };

  const categoriasComItens = CATEGORIAS.filter(
    (cat) => servicos.some((s) => s.categoria === cat.chave)
  );

  return (
    <section id="catalogo" className="scroll-mt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title text-primary">Catálogo completo</h2>
            <p className="section-sub">
              Selecione serviços, spa, barbearia, pacotes ou boutique — cotação instantânea.
            </p>
          </div>
          <button
            type="button"
            onClick={() => irParaCategoria(categoriasComItens[0]?.chave)}
            className="link-view-all"
          >
            Ver todos ›
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categoriasComItens.map((cat) => {
            const n = servicos.filter((s) => s.categoria === cat.chave).length;
            const activa = categoriaActiva === cat.chave;
            return (
              <button
                key={cat.chave}
                type="button"
                onClick={() => irParaCategoria(cat.chave)}
                className={`glow-card-soft flex flex-col items-start p-5 text-left transition ${
                  activa
                    ? 'ring-2 ring-accent shadow-glow'
                    : 'hover:-translate-y-0.5 hover:shadow-glow'
                }`}
              >
                <CategoryIcon name={cat.icon} size={22} className="h-12 w-12" />
                <h3 className="mt-4 text-sm font-semibold leading-snug text-primary">
                  {cat.titulo}
                </h3>
                <p className="mt-1 text-xs text-ink-500">{n} {n === 1 ? 'item' : 'itens'}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-8">
          {categoriasComItens.map((cat, idx) => {
            const itens = servicos.filter((s) => s.categoria === cat.chave);
            return (
              <div
                key={cat.chave}
                id={idx === 0 ? 'servicos' : undefined}
                className="scroll-mt-28"
              >
                {cat.chave === 'boutique' && <div id="boutique" className="h-0" />}
                {cat.chave === 'pacote_promocional' && <div id="pacotes" className="h-0" />}

                <article
                  id={`cat-${cat.chave}`}
                  className="overflow-hidden rounded-3xl bg-white shadow-glow ring-1 ring-secondary/25"
                >
                  <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="flex flex-col justify-between bg-primary p-6 text-light-bg sm:p-7">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
                          Secção {String(idx + 1).padStart(2, '0')}
                        </p>
                        <h3 className="font-display mt-3 text-2xl font-semibold leading-snug">
                          {cat.subtitulo}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/80">{cat.descricao}</p>
                      </div>
                      <div className="mt-6 flex items-center gap-3">
                        <CategoryIcon name={cat.icon} size={20} className="h-11 w-11 bg-white/10" />
                        <p className="text-xs font-medium text-white/70">
                          {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </div>

                    <div className="relative bg-nude-50 py-5">
                      <div className="mb-3 flex items-center justify-between px-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {cat.titulo}
                        </p>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            aria-label="Anterior"
                            onClick={() => scrollRow(rowRefs.current[cat.chave], -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary ring-1 ring-secondary/30 hover:bg-nude-100"
                          >
                            <ChevronLeft size={16} strokeWidth={1.5} />
                          </button>
                          <button
                            type="button"
                            aria-label="Seguinte"
                            onClick={() => scrollRow(rowRefs.current[cat.chave], 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary ring-1 ring-secondary/30 hover:bg-nude-100"
                          >
                            <ChevronRight size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>

                      <div
                        ref={(el) => {
                          rowRefs.current[cat.chave] = el;
                        }}
                        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] scroll-smooth"
                      >
                        {itens.map((servico) => {
                          const marcado = selecionadosIds.has(servico._id);
                          return (
                            <article
                              key={servico._id}
                              className={`flex w-[min(220px,70vw)] shrink-0 snap-start flex-col rounded-2xl bg-white p-4 ring-1 transition ${
                                marcado
                                  ? 'ring-2 ring-accent'
                                  : 'ring-secondary/20 hover:ring-secondary/50'
                              }`}
                            >
                              <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-nude-50 to-secondary/30">
                                <CategoryIcon name={cat.icon} size={24} className="h-12 w-12" />
                              </div>
                              <h4 className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-primary">
                                {servico.nome}
                              </h4>
                              {servico.itensIncluidos?.length > 0 && (
                                <p className="mt-1 line-clamp-2 text-[11px] text-ink-500">
                                  {servico.itensIncluidos.join(' · ')}
                                </p>
                              )}
                              <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                                <span className="text-sm font-bold text-accent">
                                  {formatoMt(servico.preco)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => alternar(servico._id)}
                                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                                    marcado
                                      ? 'bg-accent text-primary'
                                      : 'bg-nude-100 text-primary'
                                  }`}
                                >
                                  {marcado ? (
                                    <span className="inline-flex items-center gap-0.5">
                                      <Check size={12} strokeWidth={1.5} /> Tirar
                                    </span>
                                  ) : (
                                    'Escolher'
                                  )}
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        <aside className="glow-card sticky top-20 h-fit p-6 lg:top-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            A sua selecção
          </p>
          <h3 className="font-display mt-1 text-xl font-semibold text-primary">Cotação</h3>
          <p className="mt-1 text-xs text-ink-500">Total estimado em Meticais</p>

          {selecionados.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-nude-50 p-4 text-sm text-ink-500">
              Deslize as secções e escolha os itens para montar o pacote.
            </p>
          ) : (
            <ul className="mt-4 max-h-52 space-y-2 overflow-y-auto text-sm">
              {selecionados.map((s) => (
                <li
                  key={s._id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-nude-50 px-3 py-2 text-primary"
                >
                  <span className="min-w-0 truncate">{s.nome}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-medium text-accent">{formatoMt(s.preco)}</span>
                    <button
                      type="button"
                      aria-label={`Tirar ${s.nome} da cotação`}
                      onClick={() => alternar(s._id)}
                      className="inline-flex h-7 items-center gap-1 rounded-full bg-white px-2 text-[11px] font-semibold text-ink-500 ring-1 ring-secondary/30 transition hover:bg-rose-50 hover:text-rose-700"
                    >
                      <X size={14} strokeWidth={1.75} />
                      Tirar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex justify-between border-t border-nude-200 pt-4 text-lg font-bold">
            <span className="text-primary">Total</span>
            <span className="text-accent">{formatoMt(total)}</span>
          </div>

          <div className="mt-5 space-y-2">
            <input
              type="text"
              placeholder="Nome (opcional, para PDF)"
              value={clienteNome}
              onChange={(e) => setClienteNome(e.target.value)}
              className="input-pill text-xs"
            />
            <input
              type="tel"
              placeholder="Telefone (opcional, para PDF)"
              value={clienteTelefone}
              onChange={(e) => setClienteTelefone(e.target.value)}
              className="input-pill text-xs"
            />
          </div>

          <button
            type="button"
            disabled={selecionados.length === 0}
            onClick={exportarPdf}
            className="btn-secondary mt-4 w-full !py-2.5 text-sm"
          >
            Descarregar cotação (PDF)
          </button>

          <button
            type="button"
            disabled={selecionados.length === 0}
            onClick={() => onAgendar(selecionados)}
            className="btn-primary mt-3 w-full !py-2.5 text-sm"
          >
            Agendar visita
          </button>
        </aside>
      </div>
    </section>
  );
}
