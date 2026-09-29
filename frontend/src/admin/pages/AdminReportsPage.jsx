import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import ExportReports from '../components/ExportReports';
import {
  PeakHoursBarChart,
  TrendsLineChart,
  VolumeBarChart,
} from '../components/ReportsCharts';

export default function AdminReportsPage() {
  const [groupBy, setGroupBy] = useState('day');
  const [volume, setVolume] = useState(null);
  const [trends, setTrends] = useState(null);
  const [statusSummary, setStatusSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [vol, tr, st] = await Promise.all([
          api.getReportsVolume({ groupBy }),
          api.getReportsTrends({}),
          api.getReportsStatusSummary({}),
        ]);
        setVolume(vol);
        setTrends(tr);
        setStatusSummary(st);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="section-title">Relatórios & AI Insights</h2>
          <p className="section-sub">
            Últimos 30 dias · previsões com base na média móvel recente
          </p>
        </div>
        <ExportReports volume={volume} trends={trends} statusSummary={statusSummary} />
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {['day', 'week', 'month'].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroupBy(g)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              groupBy === g
                ? 'bg-primary text-light-bg shadow-md shadow-primary/25'
                : 'bg-white text-ink-700 ring-1 ring-brand-100 hover:bg-brand-50'
            }`}
          >
            {g === 'day' ? 'Por dia' : g === 'week' ? 'Por semana' : 'Por mês'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink-500">A carregar relatórios...</p>
      ) : (
        <>
          <section className="glow-card p-5 sm:p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-500">
              Desempenho & volume
            </h3>
            <VolumeBarChart data={volume?.series} />
          </section>

          <section className="glow-card p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500">
                Tendências & previsão
              </h3>
              {trends?.insight && (
                <p className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-ink-600 ring-1 ring-brand-100">
                  Média {trends.insight.averageDailyAppointments}/dia · Tendência{' '}
                  {trends.insight.recentTrendPercent}% · Pico{' '}
                  {trends.insight.busiestHour || '—'}
                </p>
              )}
            </div>
            <TrendsLineChart historical={trends?.historical} forecast={trends?.forecast} />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="glow-card p-5 sm:p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-500">
                Horários mais movimentados
              </h3>
              <PeakHoursBarChart peakHours={trends?.peakHours} />
            </section>
            <section className="glow-card p-5 sm:p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-500">
                Estados dos agendamentos
              </h3>
              <ul className="space-y-2">
                {(statusSummary?.byStatus || []).map((s) => (
                  <li
                    key={s.status}
                    className="flex items-center justify-between rounded-xl bg-brand-50/80 px-4 py-3 text-sm ring-1 ring-brand-100"
                  >
                    <span className="font-medium text-ink-800">{s.status}</span>
                    <span className="font-bold text-brand-600">{s.count}</span>
                  </li>
                ))}
                {!statusSummary?.byStatus?.length && (
                  <li className="text-sm text-ink-500">Sem dados no período.</li>
                )}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
