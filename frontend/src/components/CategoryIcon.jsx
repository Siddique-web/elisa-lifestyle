import {
  Scissors,
  Flower2,
  Crown,
  Percent,
  ShoppingBag,
} from 'lucide-react';

const MAPA = {
  scissors: Scissors,
  flower: Flower2,
  crown: Crown,
  percent: Percent,
  bag: ShoppingBag,
};

const STROKE = 1.5;
const GOLD = '#D4AF37';

/**
 * Ícone de categoria em círculo nude/marrom — identidade Elisa Lifestyle.
 */
export default function CategoryIcon({ name, size = 22, className = '' }) {
  const Icon = MAPA[name] || Scissors;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-nude-50 to-secondary/40 ring-1 ring-secondary/30 ${className}`}
    >
      <Icon color={GOLD} strokeWidth={STROKE} size={size} aria-hidden />
    </span>
  );
}

export { MAPA as CATEGORY_ICON_MAP };
