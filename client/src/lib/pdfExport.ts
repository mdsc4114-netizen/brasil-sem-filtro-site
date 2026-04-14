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

// Função auxiliar para remover emojis e caracteres especiais problemáticos
function sanitizeText(text: string): string {
  return text
    .replace(/[^\w\s\-.,!?()&@#áéíóúâêôãõçñ]/g, '') // Remove caracteres especiais problemáticos
    .trim();
}

// Função auxiliar para calcular altura do texto
function getTextHeight(doc: jsPDF, text: string, width: number, fontSize: number): number {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, width);
  return lines.length * (fontSize * 0.35);
}

// Função auxiliar para adicionar seção
function addSection(
  doc: jsPDF,
  title: string,
  content: string,
  x: number,
  y: number,
  width: number
): number {
  const primaryColor: [number, number, number] = [26, 58, 82];
  const textColor: [number, number, number] = [44, 62, 80];

  // Título da seção
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(title, x, y);
  y += 7;

  // Conteúdo
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const lines = doc.splitTextToSize(sanitizeText(content), width - 5);
  doc.text(lines, x + 5, y);

  return y + lines.length * 5;
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

  // Header com logo e data
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

  // Título
  doc.setTextColor(...textColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(sanitizeText(noticia.titulo), contentWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 7 + 5;

  // Subtítulo
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text(sanitizeText(noticia.subtitulo), margin, yPosition);
  yPosition += 8;

  // Separador
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // Badges de categoria e potencial viral
  doc.setFontSize(9);
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

  yPosition += 10;

  // Seção: Resumo
  yPosition = addSection(doc, 'RESUMO', noticia.resumo, margin, yPosition, contentWidth) + 5;

  // Seção: Justificativa
  yPosition = addSection(doc, 'JUSTIFICATIVA DE VIRALIZACAO', noticia.justificativa, margin, yPosition, contentWidth) + 5;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // Seção: Público-alvo
  yPosition = addSection(doc, 'PUBLICO-ALVO', noticia.publicoAlvo, margin, yPosition, contentWidth) + 5;

  // Seção: Ângulo Editorial
  yPosition = addSection(doc, 'ANGULO EDITORIAL IMPARCIAL', noticia.anguloEditorial, margin, yPosition, contentWidth) + 5;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  // Seção: Conteúdo para Redes Sociais
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CONTEUDO PARA REDES SOCIAIS', margin, yPosition);
  yPosition += 7;

  // Título para redes
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Titulo:', margin, yPosition);
  yPosition += 5;
  const titleLines2 = doc.splitTextToSize(sanitizeText(noticia.tituloRedes), contentWidth - 5);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(titleLines2, margin + 5, yPosition);
  yPosition += titleLines2.length * 5 + 5;

  // Legenda
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Legenda:', margin, yPosition);
  yPosition += 5;
  const sanitizedLegenda = sanitizeText(noticia.legenda);
  const legendLines = doc.splitTextToSize(sanitizedLegenda, contentWidth - 5);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text(legendLines, margin + 5, yPosition);
  yPosition += legendLines.length * 5 + 5;

  // Hashtags
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Hashtags:', margin, yPosition);
  yPosition += 5;
  const hashtagText = noticia.hashtags.join(' ');
  const hashtagLines = doc.splitTextToSize(hashtagText, contentWidth - 5);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...accentColor);
  doc.text(hashtagLines, margin + 5, yPosition);
  yPosition += hashtagLines.length * 5 + 5;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // Seção: Fontes
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('FONTES CONFIAVEIS', margin, yPosition);
  yPosition += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  noticia.fonte.forEach((fonte) => {
    doc.text(`- ${fonte.nome}`, margin + 5, yPosition);
    yPosition += 4;
    const urlLines = doc.splitTextToSize(fonte.url, contentWidth - 10);
    doc.setTextColor(100, 100, 100);
    doc.text(urlLines, margin + 10, yPosition);
    yPosition += urlLines.length * 3 + 2;
    doc.setTextColor(...textColor);
  });

  // Footer
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

  // Página de capa
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

  // Adicionar página para cada notícia
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
    const titleLines = doc.splitTextToSize(sanitizeText(noticia.titulo), contentWidth - 15);
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

    // Resumo
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const resumoLines = doc.splitTextToSize(sanitizeText(noticia.resumo), contentWidth);
    doc.text(resumoLines, margin, yPosition);
    yPosition += resumoLines.length * 4 + 5;

    // Justificativa
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Justificativa:', margin, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const justLines = doc.splitTextToSize(sanitizeText(noticia.justificativa), contentWidth - 5);
    doc.text(justLines, margin + 5, yPosition);
    yPosition += justLines.length * 3 + 4;

    // Público-alvo
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Publico-alvo:', margin, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const publicoLines = doc.splitTextToSize(sanitizeText(noticia.publicoAlvo), contentWidth - 5);
    doc.text(publicoLines, margin + 5, yPosition);
    yPosition += publicoLines.length * 3 + 4;

    // Hashtags
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Hashtags:', margin, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentColor);
    const hashtagText = noticia.hashtags.join(' ');
    const hashtagLines = doc.splitTextToSize(hashtagText, contentWidth - 5);
    doc.text(hashtagLines, margin + 5, yPosition);
  });

  // Footer com número de páginas
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
    sanitizeText(n.titulo),
    n.categoria,
    n.potencialViral,
    n.impacto,
    sanitizeText(n.resumo),
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
