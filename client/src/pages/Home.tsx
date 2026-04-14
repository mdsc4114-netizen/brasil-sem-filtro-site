import { useState, useMemo } from "react";
import { NewsCard } from "@/components/NewsCard";
import { NewsDetailModal } from "@/components/NewsDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, Target, Share2 } from "lucide-react";
import { toast } from "sonner";
import { ExportButton } from "@/components/ExportButton";
import noticiasData from "@/lib/noticias.json";

const noticias = noticiasData as typeof noticiasData;

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

export default function Home() {
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("viral");

  const filteredAndSorted = useMemo(() => {
    let filtered = noticias.noticias as Noticia[];

    if (filterCategory !== "all") {
      filtered = filtered.filter((n) => n.categoria === filterCategory);
    }

    if (sortBy === "viral") {
      const viralOrder = { Alto: 0, "Médio/Alto": 1, Médio: 2, Baixo: 3 };
      filtered.sort(
        (a, b) =>
          (viralOrder[a.potencialViral as keyof typeof viralOrder] || 999) -
          (viralOrder[b.potencialViral as keyof typeof viralOrder] || 999)
      );
    } else if (sortBy === "impact") {
      const impactOrder = { "Muito Alto": 0, Alto: 1, Médio: 2, Baixo: 3 };
      filtered.sort(
        (a, b) =>
          (impactOrder[a.impacto as keyof typeof impactOrder] || 999) -
          (impactOrder[b.impacto as keyof typeof impactOrder] || 999)
      );
    }

    return filtered;
  }, [filterCategory, sortBy]);

  const categorias = Array.from(
    new Set(noticias.noticias.map((n: Noticia) => n.categoria))
  );

  const handleExpandNoticia = (noticia: Noticia) => {
    setSelectedNoticia(noticia);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'url("https://d2xsxph8kpxj0f.cloudfront.net/310519663203308141/6mQ7XpkFZKYvTy5E3kB49a/hero-background-4CDGLMZyAJUetfX4NRyWNk.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent/90">
              13 de Abril de 2026
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
              Brasil Sem Filtro
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Relatório de Análise de Notícias com Potencial de Viralização
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Análise estratégica das 20 principais notícias do dia para
              TikTok, Instagram Reels, YouTube Shorts e X. Informação
              imparcial, confiável e otimizada para redes sociais.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">20</p>
              <p className="text-xs text-muted-foreground">Notícias</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">10</p>
              <p className="text-xs text-muted-foreground">Potencial Alto</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">∞</p>
              <p className="text-xs text-muted-foreground">Público-alvo</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-xs text-muted-foreground">Plataformas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros e Controles */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat as string}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viral">
                    Potencial Viral
                  </SelectItem>
                  <SelectItem value="impact">Impacto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <ExportButton noticias={filteredAndSorted} />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const url = window.location.href;
                  const text = 'Brasil Sem Filtro - Relatório de Análise de Notícias com Potencial de Viralização';
                  
                  if (navigator.share) {
                    navigator.share({
                      title: text,
                      text: text,
                      url: url,
                    }).catch((err) => console.log('Erro ao compartilhar:', err));
                  } else {
                    navigator.clipboard.writeText(`${text}\n${url}`);
                    toast.success('Link copiado para a área de transferência!');
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Notícias Grid */}
      <section className="py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAndSorted.map((noticia) => (
              <NewsCard
                key={noticia.id}
                {...noticia}
                onExpand={() => handleExpandNoticia(noticia)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="border-t border-border bg-secondary/50 py-8">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Relatório preparado por Manus AI para Brasil Sem Filtro
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Brasil Sem Filtro. Todos os direitos reservados.
          </p>
        </div>
      </section>

      {/* Modal de Detalhes */}
      {selectedNoticia && (
        <NewsDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          noticia={selectedNoticia}
        />
      )}
    </div>
  );
}
