import jsPDF from 'jspdf';

interface Noticia {
  id: number;
  titulo: string;
  subtitulo: string;
  resumo: string;
  potencialViral: string;
  categoria: string;
  impacto: string;
  tituloRedes: string;
  legenda: string;
  hashtags: string[];
}

interface RoteiroDados {
  gancho: string;
  desenvolvimento: string;
  pontoImpacto: string;
  fechamento: string;
  chamadaAcao: string;
}

/**
 * Exporta um roteiro de vídeo otimizado para leitura durante gravação
 * Layout grande e legível com cronometragem visual
 */
export function exportRoteiroVideoPDF(noticia: Noticia, roteiro: RoteiroDados): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;

  // Cores do design
  const primaryColor: [number, number, number] = [26, 58, 82]; // #1A3A52
  const accentColor: [number, number, number] = [212, 175, 55]; // #D4AF37
  const textColor: [number, number, number] = [44, 62, 80]; // #2C3E50
  const backgroundColor: [number, number, number] = [245, 247, 250]; // #F5F7FA
  const bgColorAlto: [number, number, number] = [255, 245, 245]; // Rosa suave
  const bgColorMedio: [number, number, number] = [245, 250, 255]; // Azul suave

  // ===== PÁGINA 1: INFORMAÇÕES E GANCHO =====
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ROTEIRO DE VÍDEO - BRASIL SEM FILTRO', margin, 12);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${new Date().toLocaleDateString('pt-BR')} | 30 segundos`, pageWidth - margin - 50, 12);

  let yPosition = 28;

  // Título da notícia (grande e destacado)
  doc.setTextColor(...textColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(noticia.titulo, contentWidth - 10);
  doc.text(titleLines, margin + 5, yPosition);
  yPosition += titleLines.length * 7 + 5;

  // Subtítulo
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text(noticia.subtitulo, margin + 5, yPosition);
  yPosition += 8;

  // Informações rápidas em linha
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text(`Categoria: ${noticia.categoria} | Potencial Viral: ${noticia.potencialViral} | Impacto: ${noticia.impacto}`, margin + 5, yPosition);
  yPosition += 6;

  // Separador
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(1);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 6;

  // SEÇÃO: GANCHO (0-3s) - DESTAQUE MÁXIMO
  addRoteiroSection(
    doc,
    'GANCHO (0-3s)',
    roteiro.gancho,
    margin,
    yPosition,
    contentWidth,
    'Alto',
    primaryColor,
    accentColor,
    textColor,
    backgroundColor
  );
  yPosition += 50;

  // SEÇÃO: DESENVOLVIMENTO (3-12s)
  addRoteiroSection(
    doc,
    'DESENVOLVIMENTO (3-12s)',
    roteiro.desenvolvimento,
    margin,
    yPosition,
    contentWidth,
    'Médio',
    primaryColor,
    accentColor,
    textColor,
    backgroundColor
  );
  yPosition += 50;

  // ===== PÁGINA 2: IMPACTO, FECHAMENTO E CHAMADA =====
  doc.addPage();
  yPosition = margin + 5;

  // Header na página 2
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTINUAÇÃO DO ROTEIRO', margin, 12);

  yPosition = 28;

  // SEÇÃO: PONTO DE IMPACTO (12-18s)
  addRoteiroSection(
    doc,
    'PONTO DE IMPACTO (12-18s)',
    roteiro.pontoImpacto,
    margin,
    yPosition,
    contentWidth,
    'Alto',
    primaryColor,
    accentColor,
    textColor,
    backgroundColor
  );
  yPosition += 50;

  // SEÇÃO: FECHAMENTO (18-25s)
  addRoteiroSection(
    doc,
    'FECHAMENTO (18-25s)',
    roteiro.fechamento,
    margin,
    yPosition,
    contentWidth,
    'Médio',
    primaryColor,
    accentColor,
    textColor,
    backgroundColor
  );
  yPosition += 50;

  // SEÇÃO: CHAMADA PARA AÇÃO (25-30s)
  addRoteiroSection(
    doc,
    'CHAMADA PARA AÇÃO (25-30s)',
    roteiro.chamadaAcao,
    margin,
    yPosition,
    contentWidth,
    'Alto',
    primaryColor,
    accentColor,
    textColor,
    backgroundColor
  );

  // ===== PÁGINA 3: REFERÊNCIAS E HASHTAGS =====
  doc.addPage();
  yPosition = margin + 5;

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REFERÊNCIAS E OTIMIZAÇÃO', margin, 12);

  yPosition = 28;

  // Título para redes
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Título para Redes Sociais:', margin, yPosition);
  yPosition += 6;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...accentColor);
  const titleNetLines = doc.splitTextToSize(noticia.tituloRedes, contentWidth - 10);
  doc.text(titleNetLines, margin + 5, yPosition);
  yPosition += titleNetLines.length * 5 + 8;

  // Legenda
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Legenda Otimizada:', margin, yPosition);
  yPosition += 6;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const legendLines = doc.splitTextToSize(noticia.legenda, contentWidth - 10);
  doc.text(legendLines, margin + 5, yPosition);
  yPosition += legendLines.length * 4 + 8;

  // Hashtags
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Hashtags Estratégicas:', margin, yPosition);
  yPosition += 6;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...accentColor);
  const hashtagText = noticia.hashtags.join(' ');
  const hashtagLines = doc.splitTextToSize(hashtagText, contentWidth - 10);
  doc.text(hashtagLines, margin + 5, yPosition);
  yPosition += hashtagLines.length * 4 + 8;

  // Dicas de gravação
  doc.setFillColor(...backgroundColor);
  doc.rect(margin, yPosition, contentWidth, 50, 'F');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('💡 DICAS DE GRAVAÇÃO:', margin + 5, yPosition + 5);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const tips = [
    '• Mantenha o ritmo rápido e dinâmico',
    '• Foque em expressões faciais naturais',
    '• Use gestos para enfatizar pontos-chave',
    '• Grave em local bem iluminado',
    '• Faça múltiplas takes para melhor edição',
  ];
  
  let tipY = yPosition + 12;
  tips.forEach((tip) => {
    doc.text(tip, margin + 8, tipY);
    tipY += 5;
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
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`roteiro-video-${noticia.id}-${noticia.titulo.substring(0, 20).replace(/\s+/g, '-')}.pdf`);
}

/**
 * Função auxiliar para adicionar uma seção de roteiro com design otimizado
 */
function addRoteiroSection(
  doc: jsPDF,
  title: string,
  content: string,
  x: number,
  y: number,
  width: number,
  priority: 'Alto' | 'Médio' | 'Baixo',
  primaryColor: [number, number, number],
  accentColor: [number, number, number],
  textColor: [number, number, number],
  backgroundColor: [number, number, number]
): void {
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Verificar se precisa de nova página
  if (y > pageHeight - 60) {
    doc.addPage();
    y = 30;
  }

  // Background da seção
  const bgColor: [number, number, number] = priority === 'Alto' 
    ? [255, 245, 245] // Rosa suave para alto
    : [245, 250, 255]; // Azul suave para médio
  
  doc.setFillColor(...bgColor);
  doc.rect(x, y - 3, width, 48, 'F');

  // Borda colorida à esquerda
  const borderColor: [number, number, number] = priority === 'Alto' ? accentColor : primaryColor;
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(3);
  doc.line(x, y - 3, x, y + 45);

  // Título da seção com badge de prioridade
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(...primaryColor);
  doc.rect(x + 3, y - 1, 60, 6, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + 5, y + 2);

  // Conteúdo (MUITO GRANDE para leitura fácil)
  doc.setTextColor(...textColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  
  const contentLines = doc.splitTextToSize(content, width - 10);
  const maxLines = 3; // Máximo de linhas para caber na seção
  
  let displayLines = contentLines.slice(0, maxLines);
  if (contentLines.length > maxLines) {
    displayLines[displayLines.length - 1] = displayLines[displayLines.length - 1] + '...';
  }
  
  doc.text(displayLines, x + 5, y + 10);

  // Indicador de duração
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  const durationText = title.match(/\(([^)]+)\)/)?.[1] || '';
  doc.text(durationText, x + width - 25, y + 2);
}

/**
 * Gera dados de roteiro padrão baseado na notícia
 */
export function gerarRoteiroPadrao(noticia: Noticia): RoteiroDados {
  return {
    gancho: "Atenção! [Frase impactante relacionada ao tema]. Fique por dentro!",
    desenvolvimento: "Explicação clara do contexto e fatos principais. Use dados e informações verificadas.",
    pontoImpacto: "Por que isso importa para você? Conexão direta com o cotidiano do público.",
    fechamento: "Resumo rápido da informação principal. Reforce a importância.",
    chamadaAcao: "Compartilhe este vídeo, comente sua opinião e siga Brasil Sem Filtro!",
  };
}
