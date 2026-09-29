import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { CATEGORIAS } from '../data/catalogCategories';
import { downloadQuotePdf } from '../lib/quotePdf';
import { scrollToSection } from '../lib/scrollToSection';
import CategoryIcon from './CategoryIcon';

const formatoMt = (valor) => `${valor.toLocaleString('pt-MZ')} Mt`;

export default function CatalogoServicos({ servicos, onAgendar }) {
  const [selecionadosIds, setSelecionadosIds] = useState(new Set());
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');

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

  const categoriasVisiveis = CATEGORIAS.filter((cat) => {
    const count = servicos.filter((s) => s.categoria === cat.chave).length;
    return count > 0 && (!categoriaActiva || categoriaActiva === cat.chave);
  });

  const anchorPorCategoria = useMemo(() => {
    const seen = new Set();
    const map = {};
    CATEGORIAS.forEach((cat) => {
      if (!servicos.some((s) => s.categoria === cat.chave)) return;
      if (!seen.has(cat.anchor)) {
        seen.add(cat.anchor);
        map[cat.chave] = cat.anchor;
      }
    });
    return map;
  }, [servicos]);

  const exportarPdf = () => {
    if (selecionados.length === 0) return;
    downloadQuotePdf(selecionados, {
      nome: clienteNome.trim(),
      telefone: clienteTelefone.trim(),
    });
  };

  return (
    <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="section-title text-marrom-800">Catálogo completo</h2>
          <p className="section-sub text-ink-500">
            Selecione serviços, spa, barbearia, pacotes ou boutique — cotação instantânea.
          </p>
        </div>
        <button type="button" className="link-view-all" onClick={() => setCategoriaActiva(null)}>
          Ver todos <span aria-hidden>›</span>
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIAS.map((cat) => {
          const count = servicos.filter((s) => s.categoria === cat.chave).length;
          if (count === 0) return null;
          const activa = categoriaActiva === cat.chave;
          return (
            <button
              key={cat.chave}
              type="button"
              onClick={() => {
                setCategoriaActiva(cat.chave);
                scrollToSection(cat.anchor);
              }}
              className={`glow-card-soft p-4 text-left transition hover:-translate-y-0.5 hover:shadow-glow sm:p-5 ${
                activa ? 'ring-2 ring-dourado-500' : ''
              }`}
            >
              <CategoryIcon name={cat.icon} size={22} className="h-12 w-12" />
              <p className="mt-2 text-sm font-semibold text-marrom-800">{cat.titulo}</p>
              <p className="mt-1 text-xs text-ink-500">{count} itens</p>
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          {categoriasVisiveis.map((cat) => {
              const itens = servicos.filter((s) => s.categoria === cat.chave);
              return (
                <div
                  key={cat.chave}
                  id={anchorPorCategoria[cat.chave]}
                  className="scroll-mt-28"
                >
                  <h3 className="flex items-center gap-3 font-display text-2xl font-semibold text-marrom-800">
                    <CategoryIcon name={cat.icon} size={20} className="h-11 w-11" />
                    {cat.titulo}
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {itens.map((servico) => {
                      const marcado = selecionadosIds.has(servico._id);
                      return (
                        <article
                          key={servico._id}
                          className={`glow-card group flex flex-col p-5 transition hover:shadow-glow-lg ${
                            marcado ? 'ring-2 ring-dourado-500' : ''
                          }`}
                        >
                          <div className="flex h-24 items-center justify-center rounded-2xl bg-gradient-to-br from-nude-50 to-secondary/30">
                            <CategoryIcon name={cat.icon} size={28} className="h-14 w-14" />
                          </div>
                          <h4 className="mt-4 font-semibold text-marrom-800">{servico.nome}</h4>
                          {servico.descricao && (
                            <p className="mt-1 line-clamp-2 text-xs text-ink-500">
                              {servico.descricao}
                            </p>
                          )}
                          {servico.itensIncluidos?.length > 0 && (
                            <p className="mt-2 text-xs text-ink-500">
                              Inclui: {servico.itensIncluidos.join(', ')}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                            <span className="text-lg font-bold text-dourado-600">
                              {formatoMt(servico.preco)}
                            </span>
                            <button
                              type="button"
                              onClick={() => alternar(servico._id)}
                              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                                marcado
                                  ? 'bg-dourado-500 text-marrom-800'
                                  : 'bg-nude-100 text-marrom-800 ring-1 ring-nude-200'
                              }`}
                            >
                              {marcado ? (
                                <span className="inline-flex items-center gap-1">
                                  <Check size={14} strokeWidth={1.5} /> Seleccionado
                                </span>
                              ) : (
                                'Seleccionar'
                              )}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>

        <aside className="glow-card sticky top-24 h-fit p-6 lg:top-28">
          <h3 className="font-display text-xl font-semibold text-marrom-800">Sua cotação</h3>
          <p className="mt-1 text-xs text-ink-500">Orçamento estimado (Mt)</p>

          {selecionados.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-nude-50 p-4 text-sm text-ink-500">
              Marque itens no catálogo para calcular o total.
            </p>
          ) : (
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
              {selecionados.map((s) => (
                <li key={s._id} className="flex justify-between gap-2 text-marrom-600">
                  <span className="truncate">{s.nome}</span>
                  <span className="shrink-0 font-medium text-dourado-600">
                    {formatoMt(s.preco)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex justify-between border-t border-nude-200 pt-4 text-lg font-bold">
            <span className="text-marrom-800">Total</span>
            <span className="text-dourado-600">{formatoMt(total)}</span>
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
