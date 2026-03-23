import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Building2 } from "lucide-react";
import type { CareerSuggestion } from "@/types/analysis";

interface Props {
  suggestions: CareerSuggestion[];
}

export default function CareerSuggestions({ suggestions }: Props) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-display">Recommended Career Paths</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestions.map((s, i) => (
          <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-foreground">{s.role}</h3>
              <span className="text-sm font-medium text-accent">{s.match}% match</span>
            </div>
            <Progress value={s.match} className="h-2 mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{s.reason}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {s.skills.map((skill, j) => (
                <Badge key={j} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Companies to apply */}
            {s.companies && s.companies.length > 0 && (
              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-1.5 mb-2 text-sm font-medium text-foreground">
                  <Building2 className="w-4 h-4" />
                  Companies Hiring for This Role
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.companies.map((company, j) => (
                    <a
                      key={j}
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-card border border-border hover:border-accent hover:text-accent transition-colors"
                    >
                      {company.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
