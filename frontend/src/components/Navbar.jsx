import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '../lib/scrollToSection';

const LINKS = [
  { id: 'hero', rotulo: 'Início' },
  { id: 'espaco', rotulo: 'Espaço' },
  { id: 'servicos', rotulo: 'Serviços' },
  { id: 'boutique', rotulo: 'Boutique' },
  { id: 'pacotes', rotulo: 'Pacotes' },
];

export default function Navbar() {
  const [aberto, setAberto] = useState(false);
  const [activo, setActivo] = useState('hero');

  const irPara = (id) => {
    setAberto(false);
    setActivo(id);
    scrollToSection(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-secondary/30 bg-light-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setActivo('hero')}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xs font-bold text-accent shadow-md shadow-primary/20">
            EL
          </span>
          <span className="font-display text-lg font-semibold text-ink-900">
            Elisa Lifestyle
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => irPara(link.id)}
              className={`text-sm transition ${
                activo === link.id
                  ? 'nav-link-active'
                  : 'font-medium text-ink-700 hover:text-brand-600'
              }`}
            >
              {link.rotulo}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/admin" className="btn-secondary hidden !py-2.5 !px-5 text-xs sm:inline-flex">
            Painel
          </Link>
          <button type="button" onClick={() => irPara('servicos')} className="btn-primary !py-2.5 !px-5 text-xs">
            Agendar
          </button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-ink-900 xl:hidden"
          onClick={() => setAberto((v) => !v)}
          aria-label="Abrir menu"
        >
          {aberto ? (
            <X color="#4A3B32" strokeWidth={1.5} size={22} />
          ) : (
            <Menu color="#4A3B32" strokeWidth={1.5} size={22} />
          )}
        </button>
      </div>

      {aberto && (
        <nav className="border-t border-brand-100 bg-cream-50 px-4 py-4 xl:hidden">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => irPara(link.id)}
              className="block w-full py-3 text-left text-sm font-medium text-ink-800"
            >
              {link.rotulo}
            </button>
          ))}
          <Link
            to="/admin"
            onClick={() => setAberto(false)}
            className="mt-2 block py-2 text-sm font-semibold text-brand-600"
          >
            Painel Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
