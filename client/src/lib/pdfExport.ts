import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Noticia {
  id: number;
  titulo: string;
  subtitulo: string;
  resumo: string;
  fonte: Array<{ nome: string; url: string }>;
  potencialViral: string;
  justificativa: string;
  publicoAlvo: string;
  anguloEditorial: string;
  tituloRedes: string;
  legenda: string;
  hashtags: string[];
  categoria: string;
  impacto: string;
}

/**
 * Exporta uma notícia individual para PDF com formatação profissional
 */
export async function exportNoticiaToPDF(noticia: Noticia): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Cores do design
  const primaryColor: [number, number, number] = [26, 58, 82]; // #1A3A52
  const accentColor: [number, number, number] = [212, 175, 55]; // #D4AF37
  const textColor: [number, number, number] = [44, 62, 80]; // #2C3E50
  const lightGray: [number, number, number] = [224, 231, 241]; // #E0E7F1

  // ===== HEADER =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('BRASIL SEM FILTRO', margin, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Analise de Noticia - ${new Date().toLocaleDateString('pt-BR')}`, margin, 19);

  yPosition = 35;

  // ===== TITULO PRINCIPAL =====
  doc.setTextColor(...textColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(noticia.titulo, contentWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 7 + 5;

  // ===== SUBTITULO =====
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text(noticia.subtitulo, margin, yPosition);
  yPosition += 8;

  // ===== SEPARADOR =====
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // ===== BADGES =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  // Badge categoria
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPosition - 3, 25, 6, 'F');
  doc.text(noticia.categoria, margin + 2, yPosition + 1);

  // Badge potencial viral
  const viralColors: { [key: string]: [number, number, number] } = {
    Alto: [220, 53, 69],
    'Médio/Alto': [255, 193, 7],
    Médio: [255, 193, 7],
    Baixo: [108, 117, 125],
  };
  doc.setFillColor(...(viralColors[noticia.potencialViral] || [108, 117, 125]));
  doc.rect(margin + 30, yPosition - 3, 35, 6, 'F');
  doc.text(`Viral: ${noticia.potencialViral}`, margin + 32, yPosition + 1);

  // Badge de impacto
  doc.setFillColor(...primaryColor);
  doc.rect(margin + 70, yPosition - 3, 30, 6, 'F');
  doc.text(`Impacto: ${noticia.impacto}`, margin + 72, yPosition + 1);

  yPosition += 12;

  // ===== RESUMO =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('RESUMO', margin, yPosition);
  yPosition += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const resumoLines = doc.splitTextToSize(noticia.resumo, contentWidth - 5);
  doc.text(resumoLines, margin + 5, yPosition);
  yPosition += resumoLines.length * 4 + 5;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  // ===== JUSTIFICATIVA =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('JUSTIFICATIVA DE VIRALIZACAO', margin, yPosition);
  yPosition += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const justLines = doc.splitTextToSize(noticia.justificativa, contentWidth - 5);
  doc.text(justLines, margin + 5, yPosition);
  yPosition += justLines.length * 4 + 5;

  // ===== PUBLICO-ALVO =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('PUBLICO-ALVO', margin, yPosition);
  yPosition += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const publicoLines = doc.splitTextToSize(noticia.publicoAlvo, contentWidth - 5);
  doc.text(publicoLines, margin + 5, yPosition);
  yPosition += publicoLines.length * 4 + 5;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  // ===== ANGULO EDITORIAL =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('ANGULO EDITORIAL IMPARCIAL', margin, yPosition);
  yPosition += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const anguloLines = doc.splitTextToSize(noticia.anguloEditorial, contentWidth - 5);
  doc.text(anguloLines, margin + 5, yPosition);
  yPosition += anguloLines.length * 4 + 5;

  // ===== CONTEÚDO PARA REDES SOCIAIS =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CONTEUDO PARA REDES SOCIAIS', margin, yPosition);
  yPosition += 5;

  // Título para redes
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Titulo:', margin, yPosition);
  yPosition += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const titleRedesLines = doc.splitTextToSize(noticia.tituloRedes, contentWidth - 5);
  doc.text(titleRedesLines, margin + 5, yPosition);
  yPosition += titleRedesLines.length * 3 + 4;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  // ===== LEGENDA =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Legenda:', margin, yPosition);
  yPosition += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const legendLines = doc.splitTextToSize(noticia.legenda, contentWidth - 5);
  doc.text(legendLines, margin + 5, yPosition);
  yPosition += legendLines.length * 3 + 4;

  // ===== HASHTAGS =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Hashtags:', margin, yPosition);
  yPosition += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...accentColor);
  const hashtagText = noticia.hashtags.join(' ');
  const hashtagLines = doc.splitTextToSize(hashtagText, contentWidth - 5);
  doc.text(hashtagLines, margin + 5, yPosition);
  yPosition += hashtagLines.length * 3 + 5;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // ===== FONTES CONFIÁVEIS =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('FONTES CONFIAVEIS', margin, yPosition);
  yPosition += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  noticia.fonte.forEach((fonte) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`- ${fonte.nome}`, margin + 5, yPosition);
    yPosition += 3;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const urlLines = doc.splitTextToSize(fonte.url, contentWidth - 10);
    doc.text(urlLines, margin + 10, yPosition);
    yPosition += urlLines.length * 2.5 + 2;
    
    doc.setTextColor(...textColor);
  });

  // ===== FOOTER =====
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`noticia-${noticia.id}-${noticia.titulo.substring(0, 30).replace(/\s+/g, '-')}.pdf`);
}

/**
 * Exporta todas as notícias em um relatório completo
 */
export async function exportRelatorioCompletoPDF(noticias: Noticia[]): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  const primaryColor: [number, number, number] = [26, 58, 82];
  const accentColor: [number, number, number] = [212, 175, 55];
  const textColor: [number, number, number] = [44, 62, 80];

  // ===== PÁGINA DE CAPA =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text('BRASIL SEM FILTRO', pageWidth / 2, 80, { align: 'center' });

  doc.setFontSize(24);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatorio de Analise de Noticias', pageWidth / 2, 110, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(...accentColor);
  doc.text('Com Potencial de Viralizacao', pageWidth / 2, 130, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(200, 200, 200);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 160, { align: 'center' });
  doc.text(`Total de Noticias: ${noticias.length}`, pageWidth / 2, 170, { align: 'center' });

  // ===== PÁGINA PARA CADA NOTÍCIA =====
  noticias.forEach((noticia, index) => {
    doc.addPage();
    let yPosition = margin;

    // Número da notícia
    doc.setFillColor(...primaryColor);
    doc.circle(margin + 5, yPosition + 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(String(index + 1), margin + 5, yPosition + 7, { align: 'center' });

    // Título
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(noticia.titulo, contentWidth - 15);
    doc.text(titleLines, margin + 15, yPosition);
    yPosition += titleLines.length * 6 + 5;

    // Categoria e potencial viral
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentColor);
    doc.text(`${noticia.categoria} | Viral: ${noticia.potencialViral}`, margin, yPosition);
    yPosition += 5;

    // Separador
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    // ===== RESUMO =====
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('RESUMO', margin, yPosition);
    yPosition += 4;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const resumoLines = doc.splitTextToSize(noticia.resumo, contentWidth - 5);
    doc.text(resumoLines, margin + 5, yPosition);
    yPosition += resumoLines.length * 3 + 3;

    // ===== JUSTIFICATIVA =====
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('JUSTIFICATIVA', margin, yPosition);
    yPosition += 4;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const justLines = doc.splitTextToSize(noticia.justificativa, contentWidth - 5);
    doc.text(justLines, margin + 5, yPosition);
    yPosition += justLines.length * 3 + 3;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    // ===== PUBLICO-ALVO =====
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('PUBLICO-ALVO', margin, yPosition);
    yPosition += 4;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const publicoLines = doc.splitTextToSize(noticia.publicoAlvo, contentWidth - 5);
    doc.text(publicoLines, margin + 5, yPosition);
    yPosition += publicoLines.length * 3 + 3;

    // ===== ANGULO EDITORIAL =====
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('ANGULO EDITORIAL', margin, yPosition);
    yPosition += 4;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const anguloLines = doc.splitTextToSize(noticia.anguloEditorial, contentWidth - 5);
    doc.text(anguloLines, margin + 5, yPosition);
    yPosition += anguloLines.length * 3 + 3;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    // ===== CONTEÚDO PARA REDES SOCIAIS =====
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('CONTEUDO PARA REDES SOCIAIS', margin, yPosition);
    yPosition += 4;

    // Título
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Titulo:', margin, yPosition);
    yPosition += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const titleRedesLines = doc.splitTextToSize(noticia.tituloRedes, contentWidth - 5);
    doc.text(titleRedesLines, margin + 5, yPosition);
    yPosition += titleRedesLines.length * 2.5 + 2;

    // Legenda
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Legenda:', margin, yPosition);
    yPosition += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const legendLines = doc.splitTextToSize(noticia.legenda, contentWidth - 5);
    doc.text(legendLines, margin + 5, yPosition);
    yPosition += legendLines.length * 2.5 + 2;

    // Hashtags
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Hashtags:', margin, yPosition);
    yPosition += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentColor);
    const hashtagText = noticia.hashtags.join(' ');
    const hashtagLines = doc.splitTextToSize(hashtagText, contentWidth - 5);
    doc.text(hashtagLines, margin + 5, yPosition);
    yPosition += hashtagLines.length * 2.5 + 3;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    // ===== FONTES CONFIÁVEIS =====
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('FONTES CONFIAVEIS', margin, yPosition);
    yPosition += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    noticia.fonte.forEach((fonte) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`- ${fonte.nome}`, margin + 5, yPosition);
      yPosition += 2.5;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const urlLines = doc.splitTextToSize(fonte.url, contentWidth - 10);
      doc.text(urlLines, margin + 10, yPosition);
      yPosition += urlLines.length * 2 + 1;
      
      doc.setTextColor(...textColor);
    });
  });

  // ===== FOOTER COM NÚMERO DE PÁGINAS =====
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`relatorio-completo-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Exporta dados em formato JSON
 */
export function exportToJSON(noticias: Noticia[]): void {
  const dataStr = JSON.stringify(noticias, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `noticias-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporta dados em formato CSV
 */
export function exportToCSV(noticias: Noticia[]): void {
  const headers = [
    'ID',
    'Titulo',
    'Categoria',
    'Potencial Viral',
    'Impacto',
    'Resumo',
    'Hashtags',
  ];

  const rows = noticias.map((n) => [
    n.id,
    n.titulo,
    n.categoria,
    n.potencialViral,
    n.impacto,
    n.resumo,
    n.hashtags.join(';'),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `noticias-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
