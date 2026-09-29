import { gsap, ScrollTrigger } from './gsap';

const HEADER_OFFSET = 64;

/**
 * Rolagem âncora suave. Em desktop, "espaco"/"galeria" alinha ao início do pin horizontal.
 */
export function scrollToSection(sectionId) {
  const id = sectionId === 'espaco' ? 'galeria' : sectionId;

  if (id === 'galeria') {
    const st = ScrollTrigger.getById('galeria-horizontal');
    if (st && window.matchMedia('(min-width: 1024px)').matches) {
      gsap.to(window, {
        duration: 1.1,
        scrollTo: { y: st.start, offsetY: 0, autoKill: true },
        ease: 'power3.inOut',
      });
      return;
    }
  }

  const alvo = document.getElementById(id);
  if (!alvo) return;

  gsap.to(window, {
    duration: 1.1,
    scrollTo: { y: alvo, offsetY: HEADER_OFFSET, autoKill: true },
    ease: 'power3.inOut',
  });
}
