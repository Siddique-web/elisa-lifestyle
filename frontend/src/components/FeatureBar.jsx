import { BadgeCheck, Sparkles, Calendar, Heart } from 'lucide-react';

const GOLD = '#D4AF37';

const ITENS = [
  {
    titulo: 'Profissionais certificados',
    sub: 'Equipa experiente em Beira',
    Icon: BadgeCheck,
  },
  {
    titulo: 'Produtos premium',
    sub: 'Cabelo, spa e boutique',
    Icon: Sparkles,
  },
  {
    titulo: 'Agendamento fácil',
    sub: 'Escolha serviços e horário',
    Icon: Calendar,
  },
  {
    titulo: 'Atendimento acolhedor',
    sub: 'Conforto no coração da Beira',
    Icon: Heart,
  },
];

export default function FeatureBar() {
  return (
    <div className="relative z-20 mx-auto -mt-6 max-w-6xl px-4 sm:-mt-10 sm:px-6 lg:-mt-14">
      <div className="glow-card grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:p-8">
        {ITENS.map((item) => (
          <div key={item.titulo} className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nude-50 to-secondary/40 ring-1 ring-secondary/30">
              <item.Icon color={GOLD} strokeWidth={1.5} size={22} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">{item.titulo}</p>
              <p className="mt-0.5 text-xs text-ink-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
