import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PageEntrance from '../components/PageEntrance';
import HeroCarousel from '../components/HeroCarousel';
import FeatureBar from '../components/FeatureBar';
import HorizontalGallery from '../components/HorizontalGallery';
import PromoBanner from '../components/PromoBanner';
import CatalogoServicos from '../components/CatalogoServicos';
import BookingModal from '../components/BookingModal';
import { API_URL } from '../lib/api';
import { HERO_ESPACO_SLIDES } from '../data/espacoGallery';
import { SERVICOS_CATALOGO, mergeCatalogFromApi } from '../data/catalogServices';

export default function Home() {
  const [servicos, setServicos] = useState(SERVICOS_CATALOGO);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [paraAgendar, setParaAgendar] = useState([]);
  const [mensagemOk, setMensagemOk] = useState('');
  const [catalogKey, setCatalogKey] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/servicos`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setServicos(mergeCatalogFromApi(data));
      })
      .catch(() => {
        /* catálogo local já carregado */
      });
  }, []);

  const handleAgendar = (selecionados) => {
    setParaAgendar(selecionados);
    setBookingOpen(true);
  };

  const handleBookingSuccess = () => {
    setParaAgendar([]);
    setCatalogKey((n) => n + 1);
    setMensagemOk('Agendamento enviado! A equipa confirmará em breve.');
    setTimeout(() => setMensagemOk(''), 6000);
  };

  return (
    <main className="min-h-screen bg-light-bg">
      <PageEntrance />
      <Navbar />

      {mensagemOk && (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-marrom-800 px-6 py-3 text-sm font-medium text-nude-50 shadow-glow-lg">
          {mensagemOk}
        </div>
      )}

      <HeroCarousel slides={HERO_ESPACO_SLIDES} />
      <FeatureBar />
      <HorizontalGallery servicos={servicos} />
      <PromoBanner />

      <CatalogoServicos key={catalogKey} servicos={servicos} onAgendar={handleAgendar} />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        selecionados={paraAgendar}
        onSuccess={handleBookingSuccess}
      />

      <footer className="border-t border-nude-200 bg-white py-10 text-center text-sm text-ink-500">
        <p className="font-display font-semibold text-marrom-800">Elisa Lifestyle</p>
        <p className="mt-1">Rua General Vieira da Rocha · Pioneiros · Beira</p>
      </footer>
    </main>
  );
}
