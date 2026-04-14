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
 * Cria um elemento HTML para renderização de notícia
 */
function criarElementoNoticia(noticia: Noticia): HTMLDivElement {
  const container = document.createElement('div');
  container.style.width = '210mm';
  container.style.minHeight = '297mm';
  container.style.padding = '15mm';
  container.style.backgroundColor = '#FFFFFF';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.color = '#2C3E50';
  container.style.lineHeight = '1.4';
  container.style.pageBreakAfter = 'always';

  // Header
  const header = document.createElement('div');
  header.style.backgroundColor = '#1A3A52';
  header.style.color = 'white';
  header.style.padding = '10mm';
  header.style.marginBottom = '10mm';
  header.style.borderRadius = '4px';
  header.innerHTML = `
    <div style="font-size: 18px; font-weight: bold;">BRASIL SEM FILTRO</div>
    <div style="font-size: 10px; margin-top: 3px;">${new Date().toLocaleDateString('pt-BR')}</div>
  `;
  container.appendChild(header);

  // Título
  const titulo = document.createElement('h1');
  titulo.style.fontSize = '16px';
  titulo.style.fontWeight = 'bold';
  titulo.style.marginBottom = '5px';
  titulo.style.color = '#1A3A52';
  titulo.textContent = noticia.titulo;
  container.appendChild(titulo);

  // Subtítulo
  const subtitulo = document.createElement('p');
  subtitulo.style.fontSize = '12px';
  subtitulo.style.color = '#D4AF37';
  subtitulo.style.fontWeight = 'bold';
  subtitulo.style.marginBottom = '8px';
  subtitulo.textContent = noticia.subtitulo;
  container.appendChild(subtitulo);

  // Separador
  const separador = document.createElement('hr');
  separador.style.borderColor = '#D4AF37';
  separador.style.marginBottom = '8px';
  container.appendChild(separador);

  // Badges
  const badges = document.createElement('div');
  badges.style.marginBottom = '10px';
  badges.style.fontSize = '9px';
  badges.innerHTML = `
    <span style="background-color: #1A3A52; color: white; padding: 3px 8px; border-radius: 3px; margin-right: 5px;">${noticia.categoria}</span>
    <span style="background-color: #D4AF37; color: #1A3A52; padding: 3px 8px; border-radius: 3px; margin-right: 5px;">Viral: ${noticia.potencialViral}</span>
    <span style="background-color: #1A3A52; color: white; padding: 3px 8px; border-radius: 3px;">Impacto: ${noticia.impacto}</span>
  `;
  container.appendChild(badges);

  // Função para adicionar seção
  const adicionarSecao = (titulo: string, conteudo: string) => {
    const secao = document.createElement('div');
    secao.style.marginBottom = '10px';

    const tituloSecao = document.createElement('h3');
    tituloSecao.style.fontSize = '10px';
    tituloSecao.style.fontWeight = 'bold';
    tituloSecao.style.color = '#1A3A52';
    tituloSecao.style.marginBottom = '3px';
    tituloSecao.textContent = titulo;
    secao.appendChild(tituloSecao);

    const conteudoSecao = document.createElement('p');
    conteudoSecao.style.fontSize = '9px';
    conteudoSecao.style.marginLeft = '5px';
    conteudoSecao.style.marginBottom = '0';
    conteudoSecao.textContent = conteudo;
    secao.appendChild(conteudoSecao);

    container.appendChild(secao);
  };

  // Adicionar seções
  adicionarSecao('RESUMO', noticia.resumo);
  adicionarSecao('JUSTIFICATIVA', noticia.justificativa);
  adicionarSecao('PUBLICO-ALVO', noticia.publicoAlvo);
  adicionarSecao('ANGULO EDITORIAL', noticia.anguloEditorial);

  // Conteúdo para redes sociais
  const redesSecao = document.createElement('div');
  redesSecao.style.marginBottom = '10px';
  redesSecao.innerHTML = `
    <h3 style="font-size: 10px; font-weight: bold; color: #1A3A52; margin-bottom: 3px;">CONTEUDO PARA REDES SOCIAIS</h3>
    <div style="font-size: 9px; margin-left: 5px;">
      <div style="margin-bottom: 5px;">
        <strong>Titulo:</strong><br/>
        ${noticia.tituloRedes}
      </div>
      <div style="margin-bottom: 5px;">
        <strong>Legenda:</strong><br/>
        ${noticia.legenda}
      </div>
      <div>
        <strong>Hashtags:</strong><br/>
        <span style="color: #D4AF37;">${noticia.hashtags.join(' ')}</span>
      </div>
    </div>
  `;
  container.appendChild(redesSecao);

  // Fontes
  const fontesSecao = document.createElement('div');
  fontesSecao.style.marginTop = '15px';
  fontesSecao.innerHTML = `
    <h3 style="font-size: 10px; font-weight: bold; color: #1A3A52; margin-bottom: 3px;">FONTES CONFIAVEIS</h3>
    <div style="font-size: 8px; margin-left: 5px;">
      ${noticia.fonte
        .map(
          (f) => `
        <div style="margin-bottom: 3px;">
          <strong>${f.nome}</strong><br/>
          <span style="color: #666;">${f.url}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `;
  container.appendChild(fontesSecao);

  // Footer
  const footer = document.createElement('div');
  footer.style.fontSize = '8px';
  footer.style.color = '#999';
  footer.style.marginTop = '20px';
  footer.style.textAlign = 'center';
  footer.textContent = `Brasil Sem Filtro - Analise de Noticias`;
  container.appendChild(footer);

  return container;
}

/**
 * Exporta uma notícia individual para PDF com renderização HTML2Canvas
 */
export async function exportNoticiaToPDF(noticia: Noticia): Promise<void> {
  try {
    // Criar elemento HTML
    const elemento = criarElementoNoticia(noticia);
    document.body.appendChild(elemento);

    // Renderizar para canvas
    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
    });

    // Remover elemento
    document.body.removeChild(elemento);

    // Criar PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Download
    pdf.save('noticia.pdf');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
}

/**
 * Exporta todas as notícias em um relatório completo
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

    // Adicionar cada notícia como página
    for (const noticia of noticias) {
      const elemento = criarElementoNoticia(noticia);
      document.body.appendChild(elemento);

      const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      document.body.removeChild(elemento);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }
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
