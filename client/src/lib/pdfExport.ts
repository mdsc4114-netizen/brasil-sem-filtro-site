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
 * Exporta uma notícia individual para PDF com formatação profissional e otimizado para WhatsApp
 */
export async function exportNoticiaToPDF(noticia: Noticia): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true, // Compressão para reduzir tamanho
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Cores do design
  const primaryColor: [number, number, number] = [26, 58, 82];
  const accentColor: [number, number, number] = [212, 175, 55];
  const textColor: [number, number, number] = [44, 62, 80];

  // ===== HEADER =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BRASIL SEM FILTRO', margin, 10);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${new Date().toLocaleDateString('pt-BR')}`, margin, 17);

  yPosition = 28;

  // ===== TITULO PRINCIPAL =====
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(noticia.titulo, contentWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 6 + 3;

  // ===== SUBTITULO =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text(noticia.subtitulo, margin, yPosition);
  yPosition += 6;

  // ===== SEPARADOR =====
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.4);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 4;

  // ===== BADGES =====
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  // Badge categoria
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPosition - 2.5, 22, 5, 'F');
  doc.text(noticia.categoria, margin + 1, yPosition + 1);

  // Badge potencial viral
  const viralColors: { [key: string]: [number, number, number] } = {
    Alto: [220, 53, 69],
    'Médio/Alto': [255, 193, 7],
    Médio: [255, 193, 7],
    Baixo: [108, 117, 125],
  };
  doc.setFillColor(...(viralColors[noticia.potencialViral] || [108, 117, 125]));
  doc.rect(margin + 25, yPosition - 2.5, 32, 5, 'F');
  doc.text(`Viral: ${noticia.potencialViral}`, margin + 26, yPosition + 1);

  yPosition += 8;

  // ===== RESUMO =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('RESUMO', margin, yPosition);
  yPosition += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const resumoLines = doc.splitTextToSize(noticia.resumo, contentWidth - 3);
  doc.text(resumoLines, margin + 3, yPosition);
  yPosition += resumoLines.length * 3.5 + 3;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // ===== JUSTIFICATIVA =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('JUSTIFICATIVA', margin, yPosition);
  yPosition += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const justLines = doc.splitTextToSize(noticia.justificativa, contentWidth - 3);
  doc.text(justLines, margin + 3, yPosition);
  yPosition += justLines.length * 3.5 + 3;

  // ===== PUBLICO-ALVO =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('PUBLICO-ALVO', margin, yPosition);
  yPosition += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const publicoLines = doc.splitTextToSize(noticia.publicoAlvo, contentWidth - 3);
  doc.text(publicoLines, margin + 3, yPosition);
  yPosition += publicoLines.length * 3.5 + 3;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // ===== ANGULO EDITORIAL =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('ANGULO EDITORIAL', margin, yPosition);
  yPosition += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const anguloLines = doc.splitTextToSize(noticia.anguloEditorial, contentWidth - 3);
  doc.text(anguloLines, margin + 3, yPosition);
  yPosition += anguloLines.length * 3.5 + 3;

  // ===== CONTEÚDO PARA REDES SOCIAIS =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CONTEUDO PARA REDES SOCIAIS', margin, yPosition);
  yPosition += 4;

  // Título para redes
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Titulo:', margin, yPosition);
  yPosition += 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const titleRedesLines = doc.splitTextToSize(noticia.tituloRedes, contentWidth - 3);
  doc.text(titleRedesLines, margin + 3, yPosition);
  yPosition += titleRedesLines.length * 3 + 2;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // ===== LEGENDA =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Legenda:', margin, yPosition);
  yPosition += 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const legendLines = doc.splitTextToSize(noticia.legenda, contentWidth - 3);
  doc.text(legendLines, margin + 3, yPosition);
  yPosition += legendLines.length * 3 + 2;

  // ===== HASHTAGS =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Hashtags:', margin, yPosition);
  yPosition += 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...accentColor);
  const hashtagText = noticia.hashtags.join(' ');
  const hashtagLines = doc.splitTextToSize(hashtagText, contentWidth - 3);
  doc.text(hashtagLines, margin + 3, yPosition);
  yPosition += hashtagLines.length * 3 + 3;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 35) {
    doc.addPage();
    yPosition = margin;
  }

  // ===== FONTES CONFIÁVEIS =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('FONTES CONFIAVEIS', margin, yPosition);
  yPosition += 4;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  noticia.fonte.forEach((fonte) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`- ${fonte.nome}`, margin + 3, yPosition);
    yPosition += 2.5;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const urlLines = doc.splitTextToSize(fonte.url, contentWidth - 6);
    doc.text(urlLines, margin + 6, yPosition);
    yPosition += urlLines.length * 2 + 1;
    
    doc.setTextColor(...textColor);
  });

  // ===== FOOTER =====
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Download com nome otimizado
  const fileName = `noticia-${noticia.id}.pdf`;
  doc.save(fileName);
}

/**
 * Exporta todas as notícias em um relatório completo otimizado para WhatsApp
 */
export async function exportRelatorioCompletoPDF(noticias: Noticia[]): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true, // Compressão para reduzir tamanho
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;

  const primaryColor: [number, number, number] = [26, 58, 82];
  const accentColor: [number, number, number] = [212, 175, 55];
  const textColor: [number, number, number] = [44, 62, 80];

  // ===== PÁGINA DE CAPA =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(44);
  doc.setFont('helvetica', 'bold');
  doc.text('BRASIL SEM FILTRO', pageWidth / 2, 75, { align: 'center' });

  doc.setFontSize(22);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatorio de Noticias', pageWidth / 2, 105, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(...accentColor);
  doc.text('Com Potencial de Viralizacao', pageWidth / 2, 122, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 155, { align: 'center' });
  doc.text(`${noticias.length} Noticias`, pageWidth / 2, 165, { align: 'center' });

  // ===== PÁGINA PARA CADA NOTÍCIA =====
  noticias.forEach((noticia, index) => {
    doc.addPage();
    let yPosition = margin;

    // Número da notícia
    doc.setFillColor(...primaryColor);
    doc.circle(margin + 4, yPosition + 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(String(index + 1), margin + 4, yPosition + 5, { align: 'center' });

    // Título
    doc.setTextColor(...textColor);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(noticia.titulo, contentWidth - 12);
    doc.text(titleLines, margin + 12, yPosition);
    yPosition += titleLines.length * 5.5 + 3;

    // Categoria e potencial viral
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentColor);
    doc.text(`${noticia.categoria} | Viral: ${noticia.potencialViral}`, margin, yPosition);
    yPosition += 4;

    // Separador
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 3;

    // ===== RESUMO =====
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('RESUMO', margin, yPosition);
    yPosition += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const resumoLines = doc.splitTextToSize(noticia.resumo, contentWidth - 3);
    doc.text(resumoLines, margin + 3, yPosition);
    yPosition += resumoLines.length * 2.8 + 2;

    // ===== JUSTIFICATIVA =====
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('JUSTIFICATIVA', margin, yPosition);
    yPosition += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const justLines = doc.splitTextToSize(noticia.justificativa, contentWidth - 3);
    doc.text(justLines, margin + 3, yPosition);
    yPosition += justLines.length * 2.8 + 2;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 45) {
      doc.addPage();
      yPosition = margin;
    }

    // ===== PUBLICO-ALVO =====
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('PUBLICO-ALVO', margin, yPosition);
    yPosition += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const publicoLines = doc.splitTextToSize(noticia.publicoAlvo, contentWidth - 3);
    doc.text(publicoLines, margin + 3, yPosition);
    yPosition += publicoLines.length * 2.8 + 2;

    // ===== ANGULO EDITORIAL =====
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('ANGULO EDITORIAL', margin, yPosition);
    yPosition += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const anguloLines = doc.splitTextToSize(noticia.anguloEditorial, contentWidth - 3);
    doc.text(anguloLines, margin + 3, yPosition);
    yPosition += anguloLines.length * 2.8 + 2;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 45) {
      doc.addPage();
      yPosition = margin;
    }

    // ===== CONTEÚDO PARA REDES SOCIAIS =====
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('CONTEUDO PARA REDES', margin, yPosition);
    yPosition += 3;

    // Título
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Titulo:', margin, yPosition);
    yPosition += 2.5;

    doc.setFont('helvetica', 'normal');
    const titleRedesLines = doc.splitTextToSize(noticia.tituloRedes, contentWidth - 3);
    doc.text(titleRedesLines, margin + 3, yPosition);
    yPosition += titleRedesLines.length * 2.5 + 1.5;

    // Legenda
    doc.setFont('helvetica', 'bold');
    doc.text('Legenda:', margin, yPosition);
    yPosition += 2.5;

    doc.setFont('helvetica', 'normal');
    const legendLines = doc.splitTextToSize(noticia.legenda, contentWidth - 3);
    doc.text(legendLines, margin + 3, yPosition);
    yPosition += legendLines.length * 2.5 + 1.5;

    // Hashtags
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Hashtags:', margin, yPosition);
    yPosition += 2.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentColor);
    const hashtagText = noticia.hashtags.join(' ');
    const hashtagLines = doc.splitTextToSize(hashtagText, contentWidth - 3);
    doc.text(hashtagLines, margin + 3, yPosition);
    yPosition += hashtagLines.length * 2.5 + 2;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 35) {
      doc.addPage();
      yPosition = margin;
    }

    // ===== FONTES CONFIÁVEIS =====
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('FONTES CONFIAVEIS', margin, yPosition);
    yPosition += 2.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    noticia.fonte.forEach((fonte) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`- ${fonte.nome}`, margin + 3, yPosition);
      yPosition += 2;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const urlLines = doc.splitTextToSize(fonte.url, contentWidth - 6);
      doc.text(urlLines, margin + 6, yPosition);
      yPosition += urlLines.length * 1.8 + 0.5;
      
      doc.setTextColor(...textColor);
    });
  });

  // ===== FOOTER COM NÚMERO DE PÁGINAS =====
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Download com nome simples e otimizado
  const fileName = `relatorio.pdf`;
  doc.save(fileName);
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
  link.download = `noticias.json`;
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
  link.download = `noticias.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
