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

interface TemaConfig {
  bgPrincipal: string;
  bgSecundario: string;
  textoPrincipal: string;
  textoSecundario: string;
  acento: string;
  headerBg: string;
  headerText: string;
}

const TEMAS: Record<string, TemaConfig> = {
  claro: {
    bgPrincipal: '#FFFFFF',
    bgSecundario: '#F8F9FA',
    textoPrincipal: '#1A3A52',
    textoSecundario: '#555555',
    acento: '#D4AF37',
    headerBg: '#1A3A52',
    headerText: '#FFFFFF',
  },
  escuro: {
    bgPrincipal: '#1A1A1A',
    bgSecundario: '#2A2A2A',
    textoPrincipal: '#FFFFFF',
    textoSecundario: '#CCCCCC',
    acento: '#D4AF37',
    headerBg: '#0D1B2A',
    headerText: '#FFFFFF',
  },
};

/**
 * Gera QR code em base64 usando API externa
 */
async function gerarQRCode(texto: string): Promise<string> {
  try {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(texto)}`;
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    return '';
  }
}

/**
 * Cria um elemento HTML para renderização de notícia com tema configurável
 */
async function criarElementoNoticia(noticia: Noticia, tema: string = 'claro'): Promise<HTMLDivElement> {
  const config = TEMAS[tema] || TEMAS.claro;
  const qrCode = await gerarQRCode('https://brasilsemfiltro.com');

  const container = document.createElement('div');
  container.style.width = '210mm';
  container.style.height = '297mm';
  container.style.padding = '15mm';
  container.style.backgroundColor = config.bgPrincipal;
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.color = config.textoPrincipal;
  container.style.lineHeight = '1.4';
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  // Header
  const header = document.createElement('div');
  header.style.backgroundColor = config.headerBg;
  header.style.color = config.headerText;
  header.style.padding = '12mm';
  header.style.marginBottom = '10mm';
  header.style.borderRadius = '4px';
  (header.style as any).flexShrink = 0;
  header.innerHTML = `
    <div style="font-size: 20px; font-weight: bold;">BRASIL SEM FILTRO</div>
    <div style="font-size: 11px; margin-top: 3px;">${new Date().toLocaleDateString('pt-BR')}</div>
  `;
  container.appendChild(header);

  // Título
  const titulo = document.createElement('h1');
  titulo.style.fontSize = '18px';
  titulo.style.fontWeight = 'bold';
  titulo.style.marginBottom = '4px';
  titulo.style.marginTop = '0';
  titulo.style.color = config.textoPrincipal;
  titulo.style.lineHeight = '1.3';
  titulo.textContent = noticia.titulo;
  container.appendChild(titulo);

  // Subtítulo
  const subtitulo = document.createElement('p');
  subtitulo.style.fontSize = '13px';
  subtitulo.style.color = config.acento;
  subtitulo.style.fontWeight = 'bold';
  subtitulo.style.marginBottom = '8px';
  subtitulo.style.marginTop = '0';
  subtitulo.textContent = noticia.subtitulo;
  container.appendChild(subtitulo);

  // Separador
  const separador = document.createElement('hr');
  separador.style.borderColor = config.acento;
  separador.style.marginBottom = '8px';
  separador.style.marginTop = '4px';
  separador.style.borderWidth = '1px';
  container.appendChild(separador);

  // Badges
  const badges = document.createElement('div');
  badges.style.marginBottom = '10px';
  badges.style.fontSize = '10px';
  (badges.style as any).flexShrink = 0;
  badges.innerHTML = `
    <span style="background-color: ${config.headerBg}; color: ${config.headerText}; padding: 3px 8px; border-radius: 3px; margin-right: 5px; display: inline-block;">${noticia.categoria}</span>
    <span style="background-color: ${config.acento}; color: ${config.headerBg}; padding: 3px 8px; border-radius: 3px; margin-right: 5px; display: inline-block;">Viral: ${noticia.potencialViral}</span>
    <span style="background-color: ${config.headerBg}; color: ${config.headerText}; padding: 3px 8px; border-radius: 3px; display: inline-block;">Impacto: ${noticia.impacto}</span>
  `;
  container.appendChild(badges);

  // Conteúdo scrollável
  const conteudo = document.createElement('div');
  conteudo.style.flex = '1';
  (conteudo.style as any).overflowY = 'hidden';
  conteudo.style.fontSize = '11px';
  conteudo.style.lineHeight = '1.35';

  // Função para adicionar seção
  const adicionarSecao = (tituloText: string, conteudoText: string) => {
    const secao = document.createElement('div');
    secao.style.marginBottom = '6px';

    const tituloSecao = document.createElement('h3');
    tituloSecao.style.fontSize = '11px';
    tituloSecao.style.fontWeight = 'bold';
    tituloSecao.style.color = config.textoPrincipal;
    tituloSecao.style.marginBottom = '2px';
    tituloSecao.style.marginTop = '0';
    tituloSecao.textContent = tituloText;
    secao.appendChild(tituloSecao);

    const conteudoSecao = document.createElement('p');
    conteudoSecao.style.fontSize = '10px';
    conteudoSecao.style.marginLeft = '5px';
    conteudoSecao.style.marginBottom = '0';
    conteudoSecao.style.marginTop = '0';
    conteudoSecao.style.lineHeight = '1.3';
    conteudoSecao.style.color = config.textoSecundario;
    conteudoSecao.textContent = conteudoText;
    secao.appendChild(conteudoSecao);

    conteudo.appendChild(secao);
  };

  // Adicionar seções principais
  adicionarSecao('RESUMO', noticia.resumo.substring(0, 150));
  adicionarSecao('JUSTIFICATIVA', noticia.justificativa.substring(0, 120));
  adicionarSecao('PUBLICO-ALVO', noticia.publicoAlvo);

  // Conteúdo para redes sociais
  const redesSecao = document.createElement('div');
  redesSecao.style.marginBottom = '6px';
  redesSecao.innerHTML = `
    <h3 style="font-size: 11px; font-weight: bold; color: ${config.textoPrincipal}; margin-bottom: 2px; margin-top: 0;">REDES SOCIAIS</h3>
    <div style="font-size: 10px; margin-left: 5px; line-height: 1.3; color: ${config.textoSecundario};">
      <div style="margin-bottom: 3px;"><strong>Titulo:</strong> ${noticia.tituloRedes.substring(0, 90)}</div>
      <div style="margin-bottom: 3px;"><strong>Legenda:</strong> ${noticia.legenda.substring(0, 90)}</div>
      <div><strong>Hashtags:</strong> <span style="color: ${config.acento};">${noticia.hashtags.slice(0, 4).join(' ')}</span></div>
    </div>
  `;
  conteudo.appendChild(redesSecao);

  // Fontes
  const fontesSecao = document.createElement('div');
  fontesSecao.innerHTML = `
    <h3 style="font-size: 11px; font-weight: bold; color: ${config.textoPrincipal}; margin-bottom: 2px; margin-top: 0;">FONTES</h3>
    <div style="font-size: 9px; margin-left: 5px; line-height: 1.25; color: ${config.textoSecundario};">
      ${noticia.fonte
        .slice(0, 2)
        .map(
          (f) => `
        <div style="margin-bottom: 2px;">
          <strong>${f.nome}</strong><br/>
          <span>${f.url.substring(0, 55)}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `;
  conteudo.appendChild(fontesSecao);

  container.appendChild(conteudo);

  // Footer com QR code
  const footer = document.createElement('div');
  footer.style.fontSize = '9px';
  footer.style.color = config.textoSecundario;
  footer.style.marginTop = '8px';
  footer.style.textAlign = 'center';
  footer.style.borderTop = `1px solid ${config.acento}`;
  footer.style.paddingTop = '5px';
  (footer.style as any).flexShrink = 0;
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';

  const footerText = document.createElement('div');
  footerText.textContent = 'Brasil Sem Filtro - Analise de Noticias';
  footer.appendChild(footerText);

  if (qrCode) {
    const qrImg = document.createElement('img');
    qrImg.src = qrCode;
    qrImg.style.width = '40px';
    qrImg.style.height = '40px';
    footer.appendChild(qrImg);
  }

  container.appendChild(footer);

  return container;
}

/**
 * Exporta uma notícia individual para PDF
 */
export async function exportNoticiaToPDF(noticia: Noticia, tema: string = 'claro'): Promise<void> {
  try {
    const elemento = await criarElementoNoticia(noticia, tema);
    document.body.appendChild(elemento);

    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: TEMAS[tema]?.bgPrincipal || '#FFFFFF',
      allowTaint: true,
    });

    document.body.removeChild(elemento);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

    pdf.save('noticia.pdf');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
}

/**
 * Exporta todas as notícias em um relatório completo
 */
export async function exportRelatorioCompletoPDF(noticias: Noticia[], tema: string = 'claro'): Promise<void> {
  try {
    const config = TEMAS[tema] || TEMAS.claro;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Página de capa
    pdf.setFillColor(
      parseInt(config.headerBg.substring(1, 3), 16),
      parseInt(config.headerBg.substring(3, 5), 16),
      parseInt(config.headerBg.substring(5, 7), 16)
    );
    pdf.rect(0, 0, 210, 297, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(48);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BRASIL SEM FILTRO', 105, 75, { align: 'center' });

    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Relatorio de Noticias', 105, 110, { align: 'center' });

    pdf.setFontSize(14);
    pdf.setTextColor(212, 175, 55);
    pdf.text('Com Potencial de Viralizacao', 105, 130, { align: 'center' });

    pdf.setFontSize(11);
    pdf.setTextColor(200, 200, 200);
    pdf.text(`${new Date().toLocaleDateString('pt-BR')}`, 105, 160, { align: 'center' });
    pdf.text(`${noticias.length} Noticias`, 105, 172, { align: 'center' });

    // Adicionar cada notícia
    for (const noticia of noticias) {
      const elemento = await criarElementoNoticia(noticia, tema);
      document.body.appendChild(elemento);

      const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: config.bgPrincipal,
        allowTaint: true,
      });

      document.body.removeChild(elemento);

      const imgData = canvas.toDataURL('image/png');
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    }

    pdf.save('relatorio.pdf');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
}

/**
 * Gera pré-visualização de uma notícia
 */
export async function gerarPreviewNoticia(noticia: Noticia, tema: string = 'claro'): Promise<string> {
  try {
    const elemento = await criarElementoNoticia(noticia, tema);
    document.body.appendChild(elemento);

    const canvas = await html2canvas(elemento, {
      scale: 1,
      useCORS: true,
      logging: false,
      backgroundColor: TEMAS[tema]?.bgPrincipal || '#FFFFFF',
      allowTaint: true,
    });

    document.body.removeChild(elemento);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Erro ao gerar preview:', error);
    return '';
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
