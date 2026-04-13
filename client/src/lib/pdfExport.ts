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

  // Header com logo e data
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('BRASIL SEM FILTRO', margin, 12);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Análise de Notícia - ${new Date().toLocaleDateString('pt-BR')}`, margin, 19);

  yPosition = 35;

  // Título
  doc.setTextColor(...textColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(noticia.titulo, contentWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 7 + 5;

  // Subtítulo
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text(noticia.subtitulo, margin, yPosition);
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
  
  // Badge de categoria
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPosition - 3, 30, 6, 'F');
  doc.text(noticia.categoria, margin + 2, yPosition + 1);
  
  // Badge de potencial viral
  const viralColors: Record<string, [number, number, number]> = {
    'Alto': [212, 69, 69],
    'Médio/Alto': [249, 115, 22],
    'Médio': [234, 179, 8],
    'Baixo': [107, 114, 128],
  };
  const viralColor: [number, number, number] = viralColors[noticia.potencialViral] || viralColors['Baixo'];
  doc.setFillColor(...viralColor);
  doc.rect(margin + 35, yPosition - 3, 35, 6, 'F');
  doc.text(`Viral: ${noticia.potencialViral}`, margin + 37, yPosition + 1);
  
  // Badge de impacto
  doc.setFillColor(...primaryColor);
  doc.rect(margin + 75, yPosition - 3, 30, 6, 'F');
  doc.text(`Impacto: ${noticia.impacto}`, margin + 77, yPosition + 1);
  
  yPosition += 10;

  // Seção: Resumo
  addSection(doc, 'RESUMO', noticia.resumo, margin, yPosition, contentWidth);
  yPosition += getTextHeight(doc, noticia.resumo, contentWidth, 10) + 8;

  // Seção: Justificativa
  addSection(doc, 'JUSTIFICATIVA DE VIRALIZAÇÃO', noticia.justificativa, margin, yPosition, contentWidth);
  yPosition += getTextHeight(doc, noticia.justificativa, contentWidth, 10) + 8;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // Seção: Público-alvo
  addSection(doc, 'PÚBLICO-ALVO', noticia.publicoAlvo, margin, yPosition, contentWidth);
  yPosition += getTextHeight(doc, noticia.publicoAlvo, contentWidth, 10) + 8;

  // Seção: Ângulo Editorial
  addSection(doc, 'ÂNGULO EDITORIAL IMPARCIAL', noticia.anguloEditorial, margin, yPosition, contentWidth);
  yPosition += getTextHeight(doc, noticia.anguloEditorial, contentWidth, 10) + 8;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  // Seção: Conteúdo para Redes Sociais
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CONTEÚDO PARA REDES SOCIAIS', margin, yPosition);
  yPosition += 7;

  // Título para redes
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text('Título:', margin, yPosition);
  yPosition += 5;
  const titleLines2 = doc.splitTextToSize(noticia.tituloRedes, contentWidth - 5);
  doc.setFontSize(9);
  doc.text(titleLines2, margin + 5, yPosition);
  yPosition += titleLines2.length * 5 + 5;

  // Legenda
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Legenda:', margin, yPosition);
  yPosition += 5;
  const legendLines = doc.splitTextToSize(noticia.legenda, contentWidth - 5);
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
  doc.text('FONTES CONFIÁVEIS', margin, yPosition);
  yPosition += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  noticia.fonte.forEach((fonte) => {
    doc.text(`• ${fonte.nome}`, margin + 5, yPosition);
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
      `Página ${i} de ${totalPages}`,
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
  doc.text('Relatório de Análise de Notícias', pageWidth / 2, 110, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(...accentColor);
  doc.text('Com Potencial de Viralização', pageWidth / 2, 130, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(200, 200, 200);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 160, { align: 'center' });
  doc.text(`Total de Notícias: ${noticias.length}`, pageWidth / 2, 170, { align: 'center' });

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
    const titleLines = doc.splitTextToSize(noticia.titulo, contentWidth - 20);
    doc.text(titleLines, margin + 15, yPosition + 3);
    yPosition += titleLines.length * 6 + 5;

    // Subtítulo
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    doc.text(noticia.subtitulo, margin, yPosition);
    yPosition += 6;

    // Separador
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    // Resumo
    addSection(doc, 'Resumo', noticia.resumo, margin, yPosition, contentWidth);
    yPosition += getTextHeight(doc, noticia.resumo, contentWidth, 9) + 6;

    // Potencial Viral e Impacto
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`Potencial Viral: ${noticia.potencialViral} | Impacto: ${noticia.impacto}`, margin, yPosition);
    yPosition += 6;

    // Justificativa
    addSection(doc, 'Justificativa', noticia.justificativa, margin, yPosition, contentWidth);
    yPosition += getTextHeight(doc, noticia.justificativa, contentWidth, 9) + 6;

    // Público-alvo
    addSection(doc, 'Público-alvo', noticia.publicoAlvo, margin, yPosition, contentWidth);
    yPosition += getTextHeight(doc, noticia.publicoAlvo, contentWidth, 9) + 6;

    // Ângulo Editorial
    addSection(doc, 'Ângulo Editorial', noticia.anguloEditorial, margin, yPosition, contentWidth);
    yPosition += getTextHeight(doc, noticia.anguloEditorial, contentWidth, 9) + 6;

    // Título para redes
    addSection(doc, 'Título para Redes Sociais', noticia.tituloRedes, margin, yPosition, contentWidth);
    yPosition += getTextHeight(doc, noticia.tituloRedes, contentWidth, 9) + 6;

    // Legenda
    addSection(doc, 'Legenda', noticia.legenda, margin, yPosition, contentWidth);
    yPosition += getTextHeight(doc, noticia.legenda, contentWidth, 9) + 6;

    // Hashtags
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Hashtags:', margin, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentColor);
    const hashtagText = noticia.hashtags.join(' ');
    const hashtagLines = doc.splitTextToSize(hashtagText, contentWidth);
    doc.text(hashtagLines, margin, yPosition);
  });

  // Footer em todas as páginas
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  doc.save('brasil-sem-filtro-relatorio-completo.pdf');
}

/**
 * Função auxiliar para adicionar uma seção com título e conteúdo
 */
function addSection(
  doc: jsPDF,
  title: string,
  content: string,
  x: number,
  y: number,
  width: number
): void {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 58, 82);
  doc.text(title, x, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(44, 62, 80);
  const lines = doc.splitTextToSize(content, width);
  doc.text(lines, x, y);
}

/**
 * Função auxiliar para calcular a altura do texto
 */
function getTextHeight(
  doc: jsPDF,
  text: string,
  width: number,
  fontSize: number
): number {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, width);
  return lines.length * (fontSize * 0.35);
}
