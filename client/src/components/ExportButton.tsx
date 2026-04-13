import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Loader2, Video } from "lucide-react";
import { toast } from "sonner";
import { exportRelatorioCompletoPDF } from "@/lib/pdfExport";
import { exportRoteiroVideoPDF, gerarRoteiroPadrao } from "@/lib/roteiroPdfExport";

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

interface ExportButtonProps {
  noticias: Noticia[];
  noticiaAtual?: Noticia;
}

export function ExportButton({ noticias, noticiaAtual }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await exportRelatorioCompletoPDF(noticias);
      toast.success("Relatório PDF exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar PDF");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportRoteiroVideo = () => {
    try {
      if (!noticiaAtual && noticias.length === 0) {
        toast.error("Nenhuma notícia disponível");
        return;
      }
      
      const noticia = noticiaAtual || noticias[0];
      const roteiro = gerarRoteiroPadrao(noticia);
      exportRoteiroVideoPDF(noticia, roteiro);
      toast.success("Roteiro de vídeo exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar roteiro");
      console.error(error);
    }
  };

  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify({ noticias, exportedAt: new Date().toISOString() }, null, 2);
      const element = document.createElement("a");
      element.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(dataStr));
      element.setAttribute("download", "brasil-sem-filtro-noticias.json");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Dados exportados em JSON!");
    } catch (error) {
      toast.error("Erro ao exportar JSON");
      console.error(error);
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "ID",
        "Título",
        "Categoria",
        "Potencial Viral",
        "Impacto",
        "Resumo",
      ];
      const rows = noticias.map((n) => [
        n.id,
        `"${n.titulo.replace(/"/g, '""')}"`,
        n.categoria,
        n.potencialViral,
        n.impacto,
        `"${n.resumo.replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      const element = document.createElement("a");
      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
      element.setAttribute("download", "brasil-sem-filtro-noticias.csv");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Dados exportados em CSV!");
    } catch (error) {
      toast.error("Erro ao exportar CSV");
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
          <FileText className="w-4 h-4 mr-2" />
          <span>Relatório Completo (PDF)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportRoteiroVideo} disabled={isExporting}>
          <Video className="w-4 h-4 mr-2" />
          <span>Roteiro de Vídeo (PDF)</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportJSON}>
          <Download className="w-4 h-4 mr-2" />
          <span>Dados em JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          <span>Dados em CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
