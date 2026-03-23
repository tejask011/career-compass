import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ResumeInput from "@/components/ResumeInput";
import ResultsTabs from "@/components/ResultsTabs";
import type { AnalysisResult } from "@/types/analysis";

export default function Index() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const body = { resumeText: text };

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as AnalysisResult);
    } catch (e: any) {
      toast({
        title: "Analysis failed",
        description: e.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-hero text-primary-foreground">
        <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground/90 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Guidance
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">
              Transform Your Resume Into a{" "}
              <span className="text-accent">Career Roadmap</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto font-sans">
              Upload your PDF resume and get AI-powered improvements, skill gap analysis, career suggestions, and a personalized 30-day growth plan.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-4xl mx-auto px-4 -mt-8 pb-20">
        <div className="bg-card rounded-2xl shadow-elevated p-6 md:p-10 mb-12">
          <ResumeInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-lg">Analyzing your resume with AI...</span>
            </div>
          </motion.div>
        )}

        {result && <ResultsTabs data={result} />}

        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            {[
              { title: "Resume Rewrite", desc: "Get a professionally polished version of your resume" },
              { title: "Skill Gap Analysis", desc: "Discover what skills you need to stand out" },
              { title: "30-Day Roadmap", desc: "A day-by-day plan to level up your career" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card border border-border shadow-card text-center"
              >
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Free AI-powered career guidance for everyone 🎯
      </footer>
    </div>
  );
}
