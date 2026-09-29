import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Registra os plugins uma única vez em toda a aplicação.
// (Desde a GSAP 3.12+, todos os plugins — incluindo ScrollTrigger e
// ScrollToPlugin — são gratuitos, sem necessidade de licença Club GreenSock.)
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger };
