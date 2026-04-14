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
 * Cria um elemento HTML para renderização de notícia (otimizado para 1 página)
 */
function criarElementoNoticia(noticia: Noticia): HTMLDivElement {
  const container = document.createElement('div');
  container.style.width = '210mm';
  container.style.height = '297mm';
  container.style.padding = '12mm';
  container.style.backgroundColor = '#FFFFFF';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.color = '#2C3E50';
  container.style.lineHeight = '1.3';
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  // Header
  const header = document.createElement('div');
  header.style.backgroundColor = '#1A3A52';
  header.style.color = 'white';
  (header.style as any).padding = '8mm';
  header.style.marginBottom = '8mm';
  header.style.borderRadius = '3px';
  (header.style as any).flexShrink = 0;
  header.innerHTML = `
    <div style="font-size: 16px; font-weight: bold;">BRASIL SEM FILTRO</div>
    <div style="font-size: 9px; margin-top: 2px;">${new Date().toLocaleDateString('pt-BR')}</div>
  `;
  container.appendChild(header);

  // Título
  const titulo = document.createElement('h1');
  titulo.style.fontSize = '15px';
  titulo.style.fontWeight = 'bold';
  titulo.style.marginBottom = '3px';
  titulo.style.marginTop = '0';
  titulo.style.color = '#1A3A52';
  titulo.style.lineHeight = '1.2';
  titulo.textContent = noticia.titulo;
  container.appendChild(titulo);

  // Subtítulo
  const subtitulo = document.createElement('p');
  subtitulo.style.fontSize = '11px';
  subtitulo.style.color = '#D4AF37';
  subtitulo.style.fontWeight = 'bold';
  subtitulo.style.marginBottom = '5px';
  subtitulo.style.marginTop = '0';
  subtitulo.textContent = noticia.subtitulo;
  container.appendChild(subtitulo);

  // Separador
  const separador = document.createElement('hr');
  separador.style.borderColor = '#D4AF37';
  separador.style.marginBottom = '5px';
  separador.style.marginTop = '3px';
  separador.style.borderWidth = '1px';
  container.appendChild(separador);

  // Badges
  const badges = document.createElement('div');
  (badges.style as any).marginBottom = '7px';
  badges.style.fontSize = '8px';
  (badges.style as any).flexShrink = 0;
  badges.innerHTML = `
    <span style="background-color: #1A3A52; color: white; padding: 2px 6px; border-radius: 2px; margin-right: 4px; display: inline-block;">${noticia.categoria}</span>
    <span style="background-color: #D4AF37; color: #1A3A52; padding: 2px 6px; border-radius: 2px; margin-right: 4px; display: inline-block;">Viral: ${noticia.potencialViral}</span>
    <span style="background-color: #1A3A52; color: white; padding: 2px 6px; border-radius: 2px; display: inline-block;">Impacto: ${noticia.impacto}</span>
  `;
  container.appendChild(badges);

  // Conteúdo scrollável
  const conteudo = document.createElement('div');
  conteudo.style.flex = '1';
  (conteudo.style as any).overflowY = 'hidden';
  conteudo.style.fontSize = '10px';
  conteudo.style.lineHeight = '1.25';

  // Função para adicionar seção compacta
  const adicionarSecao = (tituloText: string, conteudoText: string) => {
    const secao = document.createElement('div');
    secao.style.marginBottom = '4px';

    const tituloSecao = document.createElement('h3');
    tituloSecao.style.fontSize = '9px';
    tituloSecao.style.fontWeight = 'bold';
    tituloSecao.style.color = '#1A3A52';
    tituloSecao.style.marginBottom = '1px';
    tituloSecao.style.marginTop = '0';
    tituloSecao.textContent = tituloText;
    secao.appendChild(tituloSecao);

    const conteudoSecao = document.createElement('p');
    conteudoSecao.style.fontSize = '9px';
    conteudoSecao.style.marginLeft = '3px';
    conteudoSecao.style.marginBottom = '0';
    conteudoSecao.style.marginTop = '0';
    conteudoSecao.style.lineHeight = '1.2';
    conteudoSecao.textContent = conteudoText;
    secao.appendChild(conteudoSecao);

    conteudo.appendChild(secao);
  };

  // Adicionar seções principais (resumidas)
  adicionarSecao('RESUMO', (noticia.resumo as string).substring(0, 120) + '...');
  adicionarSecao('JUSTIFICATIVA', (noticia.justificativa as string).substring(0, 100) + '...');
  adicionarSecao('PUBLICO-ALVO', (noticia.publicoAlvo as string));

  // Conteúdo para redes sociais (compacto)
  const redesSecao = document.createElement('div');
  redesSecao.style.marginBottom = '4px';
  redesSecao.innerHTML = `
    <h3 style="font-size: 9px; font-weight: bold; color: #1A3A52; margin-bottom: 1px; margin-top: 0;">REDES SOCIAIS</h3>
    <div style="font-size: 9px; margin-left: 3px; line-height: 1.2;">
      <div style="margin-bottom: 2px;"><strong>Titulo:</strong> ${(noticia.tituloRedes as string).substring(0, 80)}</div>
      <div style="margin-bottom: 2px;"><strong>Legenda:</strong> ${(noticia.legenda as string).substring(0, 80)}</div>
      <div><strong>Hashtags:</strong> <span style="color: #D4AF37;">${(noticia.hashtags as string[]).slice(0, 3).join(' ')}</span></div>
    </div>
  `;
  conteudo.appendChild(redesSecao);

  // Fontes (compacto)
  const fontesSecao = document.createElement('div');
  fontesSecao.innerHTML = `
    <h3 style="font-size: 9px; font-weight: bold; color: #1A3A52; margin-bottom: 1px; margin-top: 0;">FONTES</h3>
    <div style="font-size: 8px; margin-left: 3px; line-height: 1.15;">
      ${noticia.fonte
        .slice(0, 2)
        .map(
          (f) => `
        <div style="margin-bottom: 1px;">
          <strong>${f.nome}</strong><br/>
          <span style="color: #666;">${f.url.substring(0, 50)}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `;
  conteudo.appendChild(fontesSecao);

  container.appendChild(conteudo);

  // Footer
  const footer = document.createElement('div');
  footer.style.fontSize = '8px';
  footer.style.color = '#999';
  footer.style.marginTop = '5px';
  footer.style.textAlign = 'center';
  footer.style.borderTop = '1px solid #DDD';
  footer.style.paddingTop = '3px';
  (footer.style as any).flexShrink = 0;
  footer.textContent = `Brasil Sem Filtro - Analise de Noticias`;
  container.appendChild(footer);

  return container;
}

/**
 * Exporta uma notícia individual para PDF com renderização HTML2Canvas (1 página)
 */
export async function exportNoticiaToPDF(noticia: Noticia): Promise<void> {
  try {
    // Criar elemento HTML
    const elemento = criarElementoNoticia(noticia);
    document.body.appendChild(elemento);

    // Renderizar para canvas com escala apropriada
    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      allowTaint: true,
    });

    // Remover elemento
    document.body.removeChild(elemento);

    // Criar PDF com uma única página
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

    // Download
    pdf.save('noticia.pdf');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
}

/**
 * Exporta todas as notícias em um relatório completo (1 página por notícia)
 */
export async function exportRelatorioCompletoPDF(noticias: Noticia[]): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Página de capa
    pdf.setFillColor(26, 58, 82);
    pdf.rect(0, 0, 210, 297, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(44);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BRASIL SEM FILTRO', 105, 75, { align: 'center' });

    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Relatorio de Noticias', 105, 105, { align: 'center' });

    pdf.setFontSize(13);
    pdf.setTextColor(212, 175, 55);
    pdf.text('Com Potencial de Viralizacao', 105, 122, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setTextColor(200, 200, 200);
    pdf.text(`${new Date().toLocaleDateString('pt-BR')}`, 105, 155, { align: 'center' });
    pdf.text(`${noticias.length} Noticias`, 105, 165, { align: 'center' });

    // Adicionar cada notícia como página (1 página por notícia)
    for (const noticia of noticias) {
      const elemento = criarElementoNoticia(noticia);
      document.body.appendChild(elemento);

      const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        allowTaint: true,
      });

      document.body.removeChild(elemento);

      const imgData = canvas.toDataURL('image/png');
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    }

    // Download
    pdf.save('relatorio.pdf');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
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
