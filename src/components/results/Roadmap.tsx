import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2 } from "lucide-react";
import type { RoadmapPhase } from "@/types/analysis";

interface Props {
  phases: RoadmapPhase[];
}

export default function Roadmap({ phases }: Props) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-display">Your 30-Day Career Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {phases.map((phase, i) => (
              <div key={i} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full gradient-accent border-2 border-card" />

                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      Day {phase.day}: {phase.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {phase.timeEstimate}
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
