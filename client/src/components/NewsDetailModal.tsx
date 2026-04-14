import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, Share2, FileText, Video } from "lucide-react";
import { exportNoticiaToPDF } from "@/lib/pdfExport";
import { exportRoteiroVideoPDF, gerarRoteiroPadrao } from "@/lib/roteiroPdfExport";
import { ExportModal } from "./ExportModal";
import { useState } from "react";
import { toast } from "sonner";

interface NewsDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noticia: {
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
  };
}

export function NewsDetailModal({
  open,
  onOpenChange,
  noticia,
}: NewsDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = async () => {
    setShowExportModal(true);
  };

  const handleExportRoteiroVideo = () => {
    try {
      const roteiro = gerarRoteiroPadrao(noticia);
      exportRoteiroVideoPDF(noticia, roteiro);
      toast.success("Roteiro de vídeo exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar roteiro");
      console.error(error);
    }
  };

  const downloadAsText = () => {
    const content = `
BRASIL SEM FILTRO - ANÁLISE DE NOTÍCIA
=====================================

Título: ${noticia.titulo}
Subtítulo: ${noticia.subtitulo}

RESUMO
------
${noticia.resumo}

POTENCIAL VIRAL: ${noticia.potencialViral}
IMPACTO: ${noticia.impacto}

JUSTIFICATIVA
-------------
${noticia.justificativa}

PÚBLICO-ALVO
-----------
${noticia.publicoAlvo}

ÂNGULO EDITORIAL
----------------
${noticia.anguloEditorial}

TÍTULO PARA REDES SOCIAIS
------------------------
${noticia.tituloRedes}

LEGENDA OTIMIZADA
-----------------
${noticia.legenda}

HASHTAGS
--------
${noticia.hashtags.join(" ")}

FONTES
------
${noticia.fonte.map((f) => `${f.nome}: ${f.url}`).join("\n")}
    `;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", `noticia-${noticia.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Arquivo baixado com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="font-display text-3xl mb-2">
                {noticia.titulo}
              </DialogTitle>
              <p className="text-sm font-semibold text-accent">
                {noticia.subtitulo}
              </p>
            </div>
            <Badge variant="outline" className="whitespace-nowrap">
              {noticia.potencialViral}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Resumo */}
            <div>
              <h3 className="font-display text-lg font-bold mb-2 text-primary">
                Resumo
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {noticia.resumo}
              </p>
            </div>

            {/* Análise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-display text-lg font-bold mb-2 text-primary">
                  Justificativa de Viralização
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {noticia.justificativa}
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold mb-2 text-primary">
                  Público-Alvo
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {noticia.publicoAlvo}
                </p>
              </div>
            </div>

            {/* Ângulo Editorial */}
            <div>
              <h3 className="font-display text-lg font-bold mb-2 text-primary">
                Ângulo Editorial Imparcial
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {noticia.anguloEditorial}
              </p>
            </div>

            {/* Conteúdo para Redes Sociais */}
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-display text-lg font-bold mb-3 text-primary">
                Conteúdo para Redes Sociais
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">
                    Título
                  </p>
                  <div className="flex gap-2">
                    <p className="text-sm font-semibold text-foreground flex-1">
                      {noticia.tituloRedes}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(noticia.tituloRedes)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">
                    Legenda
                  </p>
                  <div className="flex gap-2">
                    <p className="text-sm text-foreground flex-1 whitespace-pre-wrap">
                      {noticia.legenda}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(noticia.legenda)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-2">
                    Hashtags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {noticia.hashtags.map((tag, idx) => (
                      <Badge key={idx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() =>
                      copyToClipboard(noticia.hashtags.join(" "))
                    }
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar Hashtags
                  </Button>
                </div>
              </div>
            </div>

            {/* Fontes */}
            <div>
              <h3 className="font-display text-lg font-bold mb-2 text-primary">
                Fontes Confiáveis
              </h3>
              <div className="space-y-2">
                {noticia.fonte.map((f, idx) => (
                  <a
                    key={idx}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-secondary rounded hover:bg-secondary/80 transition-colors"
                  >
                    <p className="font-semibold text-sm text-primary">
                      {f.nome}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {f.url}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Ações */}
        <div className="flex gap-2 pt-4 border-t flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Análise PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportRoteiroVideo}>
            <Video className="w-4 h-4 mr-2" />
            Roteiro Vídeo
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAsText}>
            <Download className="w-4 h-4 mr-2" />
            TXT
          </Button>
          <Button variant="default" className="flex-1" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
      
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        noticia={noticia}
      />
    </Dialog>
  );
}
