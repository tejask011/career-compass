import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Video, BookOpen, Search } from "lucide-react";
import type { SkillGap } from "@/types/analysis";

const importanceColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-accent/10 text-accent border-accent/20",
  low: "bg-muted text-muted-foreground border-border",
};

function getResourceLinks(skill: string) {
  const q = encodeURIComponent(skill + " tutorial");
  return [
    {
      title: `Learn ${skill} – YouTube`,
      type: "video" as const,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " full course for beginners")}`,
    },
    {
      title: `${skill} – Google Search`,
      type: "article" as const,
      url: `https://www.google.com/search?q=${q}`,
    },
    {
      title: `${skill} – freeCodeCamp`,
      type: "course" as const,
      url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`,
    },
  ];
}

interface Props {
  gaps: SkillGap[];
}

export default function SkillGaps({ gaps }: Props) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-display">Skill Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gaps.map((gap, i) => {
          const resources = gap.recommendedResources?.length
            ? gap.recommendedResources
            : getResourceLinks(gap.skill);

          return (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{gap.skill}</span>
                  <Badge variant="outline" className={importanceColors[gap.importance]}>
                    {gap.importance}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{gap.reason}</p>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
                    📚 Study Resources
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border text-xs font-medium text-muted-foreground hover:text-accent hover:border-accent/50 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        {res.type === "video" && <Video className="w-3.5 h-3.5 text-red-500" />}
                        {res.type === "article" && <Search className="w-3.5 h-3.5 text-blue-500" />}
                        {res.type === "course" && <BookOpen className="w-3.5 h-3.5 text-green-500" />}
                        <span>{res.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-40" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
