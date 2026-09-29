import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api';

const VISITAS = [
  { id: 'salao', label: 'Salão (cabelo / barbearia)' },
  { id: 'spa', label: 'Spa & estética' },
  { id: 'boutique', label: 'Boutique' },
  { id: 'misto', label: 'Visita combinada' },
];

const formatoMt = (v) => `${Number(v).toLocaleString('pt-MZ')} Mt`;

export default function BookingModal({ open, onClose, selecionados, onSuccess }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [visitType, setVisitType] = useState('misto');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!open) return null;

  const total = selecionados.reduce((s, x) => s + x.preco, 0);

  const submit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await api.createAppointment({
        clienteName: nome.trim(),
        clientePhone: telefone.trim(),
        clienteEmail: email.trim() || undefined,
        serviceIds: selecionados.map((s) => s._id || s.slug),
        services: selecionados.map((s) => ({
          _id: s._id,
          slug: s.slug || s._id,
          nome: s.nome,
          preco: s.preco,
        })),
        data,
        horario,
        visitType,
        observacoes: observacoes.trim() || undefined,
      });
      onSuccess?.();
      onClose();
      setNome('');
      setTelefone('');
      setEmail('');
      setData('');
      setHorario('');
      setObservacoes('');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-900/50 p-4 sm:items-center">
      <div
        className="glow-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8"
        role="dialog"
        aria-labelledby="booking-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="booking-title" className="font-display text-2xl font-semibold text-marrom-800">
              Agendar visita
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {selecionados.length} item(ns) · Total {formatoMt(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-500 hover:bg-nude-100"
            aria-label="Fechar"
          >
            <X color="#4A3B32" strokeWidth={1.5} size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-marrom-800">Nome completo</label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-pill mt-1"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-marrom-800">Telefone</label>
              <input
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="input-pill mt-1"
                placeholder="+258 ..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-marrom-800">E-mail (opcional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-pill mt-1"
              />
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-marrom-800">Onde pretende ser atendida?</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {VISITAS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVisitType(v.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    visitType === v.id
                      ? 'bg-dourado-500 text-marrom-800 shadow-sm'
                      : 'bg-nude-100 text-ink-700 ring-1 ring-nude-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-marrom-800">Data</label>
              <input
                required
                type="date"
                value={data}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setData(e.target.value)}
                className="input-pill mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-marrom-800">Horário</label>
              <input
                required
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="input-pill mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-marrom-800">Observações</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-2xl border border-nude-200 bg-nude-50 px-4 py-3 text-sm focus:border-dourado-400 focus:outline-none focus:ring-2 focus:ring-dourado-200"
              placeholder="Preferências, alergias, ocasião especial..."
            />
          </div>

          {erro && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{erro}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'A enviar...' : 'Confirmar agendamento'}
          </button>
        </form>
      </div>
    </div>
  );
}
