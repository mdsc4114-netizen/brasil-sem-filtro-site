import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, Share2, ExternalLink } from "lucide-react";
import { useState } from "react";

interface NewsCardProps {
  id: number;
  titulo: string;
  subtitulo: string;
  resumo: string;
  potencialViral: string;
  categoria: string;
  impacto: string;
  fonte: Array<{ nome: string; url: string }>;
  tituloRedes: string;
  legenda: string;
  hashtags: string[];
  onExpand?: () => void;
}

export function NewsCard({
  id,
  titulo,
  subtitulo,
  resumo,
  potencialViral,
  categoria,
  impacto,
  fonte,
  onExpand,
}: NewsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getViralColor = (nivel: string) => {
    switch (nivel) {
      case "Alto":
        return "bg-red-50 text-red-700 border-red-200";
      case "Médio/Alto":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Médio":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Economia: "bg-blue-100 text-blue-800",
      Política: "bg-purple-100 text-purple-800",
      "Política Internacional": "bg-indigo-100 text-indigo-800",
      Mídia: "bg-green-100 text-green-800",
    };
    return colors[cat] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-xl border-l-4 border-l-primary hover:border-l-accent hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 space-y-4">
        {/* Header com número e categoria */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display text-lg font-bold text-primary">
                {id}
              </span>
            </div>
            <Badge variant="secondary" className={getCategoryColor(categoria)}>
              {categoria}
            </Badge>
          </div>
          <Badge variant="outline" className={getViralColor(potencialViral)}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {potencialViral}
          </Badge>
        </div>

        {/* Título e Subtítulo */}
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
            {titulo}
          </h3>
          <p className="text-sm font-semibold text-accent mb-3">{subtitulo}</p>
        </div>

        {/* Resumo */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {resumo}
        </p>

        {/* Fonte */}
        <div className="pb-4 border-b border-border">
          <p className="text-xs font-mono text-muted-foreground mb-2">
            Fontes:
          </p>
          <div className="flex flex-wrap gap-2">
            {fonte.map((f, idx) => (
              <a
                key={idx}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded hover:bg-primary/10 transition-colors"
              >
                {f.nome}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

        {/* Impacto */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            Impacto:
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  impacto === "Muito Alto"
                    ? "bg-primary"
                    : impacto === "Alto"
                      ? i <= 2
                        ? "bg-primary"
                        : "bg-border"
                      : i === 1
                        ? "bg-primary"
                        : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onExpand}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Ver Detalhes
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Share2 className="w-4 h-4 mr-1" />
            Compartilhar
          </Button>
        </div>

        {/* Indicador de hover */}
        {isHovered && (
          <div className="absolute top-0 right-0 w-1 h-full bg-accent animate-pulse" />
        )}
      </div>
    </Card>
  );
}
