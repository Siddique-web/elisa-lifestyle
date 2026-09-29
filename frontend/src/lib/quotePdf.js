import { jsPDF } from 'jspdf';
import { LABEL_CATEGORIA } from '../data/catalogCategories';

/** Paleta oficial: primary #4A3B32, secondary #D2B48C, accent #D4AF37, light-bg #F9F8F6, dark-text #1A1A1A */
const CORES = {
  primary: [74, 59, 50],
  secondary: [210, 180, 140],
  accent: [212, 175, 55],
  light: [249, 248, 246],
  dark: [26, 26, 26],
  muted: [107, 92, 82],
};

function formatoMt(valor) {
  return `${Number(valor).toLocaleString('pt-MZ')} Mt`;
}

/**
 * @param {{ nome: string, preco: number, categoria?: string }[]} itens
 * @param {{ nome?: string, telefone?: string }} cliente
 */
export function downloadQuotePdf(itens, cliente = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = margin;

  doc.setFillColor(...CORES.light);
  doc.rect(0, 0, pageW, 44, 'F');
  doc.setFillColor(...CORES.primary);
  doc.rect(0, 0, 6, 44, 'F');
  doc.setFillColor(...CORES.accent);
  doc.rect(0, 42, pageW, 2.2, 'F');

  doc.setTextColor(...CORES.primary);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Elisa Lifestyle', margin + 4, y + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...CORES.muted);
  doc.text('Cabeleireiro · Boutique · Spa', margin + 4, y + 17);
  doc.text('Rua General Vieira da Rocha, Pioneiros — Beira, Moçambique', margin + 4, y + 23);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...CORES.accent);
  doc.text('Cotação personalizada', pageW - margin, y + 12, { align: 'right' });

  const dataStr = new Date().toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...CORES.muted);
  doc.text(dataStr, pageW - margin, y + 19, { align: 'right' });

  y = 54;

  if (cliente.nome || cliente.telefone) {
    doc.setFillColor(...CORES.secondary);
    doc.roundedRect(margin, y, pageW - margin * 2, 16, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(...CORES.primary);
    doc.text(
      `Cliente: ${cliente.nome || '—'}  ·  Tel: ${cliente.telefone || '—'}`,
      margin + 4,
      y + 10
    );
    y += 22;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...CORES.primary);
  doc.text('Itens seleccionados', margin, y);
  y += 8;

  const total = itens.reduce((s, i) => s + i.preco, 0);

  itens.forEach((item) => {
    if (y > 250) {
      doc.addPage();
      y = margin;
    }
    doc.setFillColor(...CORES.light);
    doc.roundedRect(margin, y, pageW - margin * 2, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...CORES.dark);
    doc.text(item.nome, margin + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...CORES.muted);
    const cat = LABEL_CATEGORIA[item.categoria] || item.categoria || '';
    if (cat) doc.text(cat, margin + 4, y + 11);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...CORES.accent);
    doc.text(formatoMt(item.preco), pageW - margin - 4, y + 9, { align: 'right' });
    y += 16;
  });

  y += 4;
  doc.setDrawColor(...CORES.accent);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  doc.setFillColor(...CORES.primary);
  doc.roundedRect(margin, y, pageW - margin * 2, 18, 3, 3, 'F');
  doc.setTextColor(249, 248, 246);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total estimado', margin + 6, y + 11);
  doc.setTextColor(...CORES.accent);
  doc.text(formatoMt(total), pageW - margin - 6, y + 11, { align: 'right' });

  y += 28;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...CORES.muted);
  doc.text(
    'Valores estimados com base no catálogo actual. Confirmação final no atendimento presencial.',
    margin,
    y,
    { maxWidth: pageW - margin * 2 }
  );
  doc.text('Obrigada por escolher a Elisa Lifestyle.', margin, y + 8);

  doc.save(`elisa-cotacao-${Date.now()}.pdf`);
}
