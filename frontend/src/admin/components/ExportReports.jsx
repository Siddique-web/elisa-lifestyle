import { useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { api } from '../../lib/api';

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export default function ExportReports({ volume, trends, statusSummary }) {
  const range = defaultRange();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const fetchRows = async () => {
    const { rows } = await api.getExportData(range);
    return rows;
  };

  const exportPdf = async () => {
    setError('');
    setBusy('pdf');
    const rows = await fetchRows();
    const doc = new jsPDF({ orientation: 'landscape' });
    const margin = 14;
    let y = margin;

    doc.setFillColor(74, 59, 50);
    doc.rect(0, 0, 297, 16, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(16);
    doc.text('Elisa Lifestyle — Relatório Operacional', margin, 11);
    doc.setTextColor(74, 59, 50);
    y = 24;

    doc.setFontSize(10);
    doc.text(`Período: ${range.from} a ${range.to}`, margin, y);
    y += 10;

    if (volume?.series?.length) {
      doc.setFontSize(12);
      doc.text('Volume (resumo)', margin, y);
      y += 6;
      doc.setFontSize(9);
      volume.series.slice(-10).forEach((row) => {
        doc.text(
          `${row.period}: ${row.appointments} agend. · ${row.revenue} Mt`,
          margin,
          y
        );
        y += 5;
        if (y > 190) {
          doc.addPage();
          y = margin;
        }
      });
      y += 4;
    }

    if (trends?.insight) {
      doc.setFontSize(12);
      doc.text('AI Insights', margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.text(
        `Média diária: ${trends.insight.averageDailyAppointments} · Tendência: ${trends.insight.recentTrendPercent}% · Hora de pico: ${trends.insight.busiestHour || '—'}`,
        margin,
        y
      );
      y += 8;
    }

    doc.setFontSize(12);
    doc.text('Detalhe de agendamentos', margin, y);
    y += 6;
    doc.setFontSize(8);
    rows.slice(0, 40).forEach((row) => {
      const line = `${row.data.slice(0, 10)} | ${row.cliente} | ${row.status} | ${row.valorTotal} Mt`;
      doc.text(line, margin, y);
      y += 4;
      if (y > 190) {
        doc.addPage();
        y = margin;
      }
    });

    doc.save(`elisa-relatorio-${range.to}.pdf`);
    setBusy(null);
  };

  const exportExcel = async () => {
    setError('');
    setBusy('xlsx');
    const rows = await fetchRows();

    const summarySheet = XLSX.utils.json_to_sheet(
      (volume?.series || []).map((r) => ({
        Período: r.period,
        Agendamentos: r.appointments,
        Receita_Mt: r.revenue,
      }))
    );

    const statusSheet = XLSX.utils.json_to_sheet(
      (statusSummary?.byStatus || []).map((s) => ({
        Estado: s.status,
        Quantidade: s.count,
      }))
    );

    const detailSheet = XLSX.utils.json_to_sheet(
      rows.map((r) => ({
        Data: r.data,
        Cliente: r.cliente,
        Telefone: r.telefone,
        Profissional: r.profissional,
        Serviços: r.servicos,
        Total_Mt: r.valorTotal,
        Estado: r.status,
      }))
    );

    const forecastSheet = XLSX.utils.json_to_sheet(
      (trends?.forecast || []).map((f) => ({
        Data: f.period,
        Previsao_Atendimentos: f.predicted,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Volume');
    XLSX.utils.book_append_sheet(wb, statusSheet, 'Estados');
    XLSX.utils.book_append_sheet(wb, detailSheet, 'Agendamentos');
    XLSX.utils.book_append_sheet(wb, forecastSheet, 'Previsao');
    XLSX.writeFile(wb, `elisa-relatorio-${range.to}.xlsx`);
    setBusy(null);
  };

  const wrap = (fn) => async () => {
    try {
      await fn();
    } catch (err) {
      setError(err.message || 'Falha na exportação.');
      setBusy(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!!busy}
          onClick={wrap(exportPdf)}
          className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60"
        >
          {busy === 'pdf' ? 'A gerar PDF...' : 'Exportar PDF'}
        </button>
        <button
          type="button"
          disabled={!!busy}
          onClick={wrap(exportExcel)}
          className="btn-secondary !px-5 !py-2.5 text-sm disabled:opacity-60"
        >
          {busy === 'xlsx' ? 'A gerar Excel...' : 'Exportar Excel'}
        </button>
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
