import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { exportNoticiaToPDF, gerarPreviewNoticia } from '@/lib/pdfExport';

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

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  noticia: Noticia | null;
}

export function ExportModal({ isOpen, onClose, noticia }: ExportModalProps) {
  if (!isOpen) return null;
  
  const [tema, setTema] = useState<'claro' | 'escuro'>('claro');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTemaChange = async (novoTema: string) => {
    setTema(novoTema as 'claro' | 'escuro');
    setLoading(true);
    if (noticia) {
      const previewImg = await gerarPreviewNoticia(noticia, novoTema);
      setPreview(previewImg);
    }
    setLoading(false);
  };

  const handleExportar = async () => {
    if (noticia) {
      await exportNoticiaToPDF(noticia, tema);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exportar Notícia para PDF</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seletor de Tema */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Selecione o Tema</h3>
            <RadioGroup value={tema} onValueChange={handleTemaChange}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="claro" id="tema-claro" />
                <Label htmlFor="tema-claro" className="cursor-pointer flex-1">
                  <div className="font-medium">Tema Claro</div>
                  <div className="text-sm text-gray-600">Fundo branco com texto escuro</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="escuro" id="tema-escuro" />
                <Label htmlFor="tema-escuro" className="cursor-pointer flex-1">
                  <div className="font-medium">Tema Escuro</div>
                  <div className="text-sm text-gray-600">Fundo escuro com texto claro</div>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-3 mt-6">
              <h3 className="font-semibold">Informações do PDF</h3>
              <div className="text-sm space-y-2 text-gray-600">
                <p>✓ 1 página por notícia</p>
                <p>✓ Fontes otimizadas para leitura</p>
                <p>✓ QR code do canal incluído</p>
                <p>✓ Compatível com WhatsApp</p>
              </div>
            </div>

            <Button onClick={handleExportar} className="w-full mt-6" size="lg">
              Exportar PDF
            </Button>
          </div>

          {/* Pré-visualização */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Pré-visualização</h3>
            <div className="border rounded-lg bg-gray-100 p-2 h-[500px] overflow-y-auto flex items-center justify-center">
              {loading ? (
                <div className="text-gray-500">Gerando pré-visualização...</div>
              ) : preview ? (
                <img src={preview} alt="Preview PDF" className="max-w-full h-auto" />
              ) : (
                <div className="text-gray-500">Selecione um tema para visualizar</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
