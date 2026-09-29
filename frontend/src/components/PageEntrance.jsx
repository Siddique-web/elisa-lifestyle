import { useEffect, useState } from 'react';

/** Splash inicial (~1,4s) — só CSS, compatível com React Strict Mode. */
export default function PageEntrance() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="page-entrance-overlay pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-light-bg"
      aria-hidden
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-accent shadow-glow">
        EL
      </span>
      <p className="font-display text-xl font-semibold text-marrom-800">Elisa Lifestyle</p>
      <p className="text-xs text-ink-500">Beira · Moçambique</p>
    </div>
  );
}
