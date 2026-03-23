import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, AlertTriangle, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import ImprovedResume from "./results/ImprovedResume";
import SkillGaps from "./results/SkillGaps";
import CareerSuggestions from "./results/CareerSuggestions";
import Roadmap from "./results/Roadmap";
import type { AnalysisResult } from "@/types/analysis";

interface ResultsTabsProps {
  data: AnalysisResult;
}

export default function ResultsTabs({ data }: ResultsTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14 rounded-xl bg-muted p-1">
          <TabsTrigger value="resume" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-card">
            <FileCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Improved Resume</span>
            <span className="sm:hidden">Resume</span>
          </TabsTrigger>
          <TabsTrigger value="gaps" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-card">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Skill Gaps</span>
            <span className="sm:hidden">Gaps</span>
          </TabsTrigger>
          <TabsTrigger value="careers" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-card">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Career Paths</span>
            <span className="sm:hidden">Careers</span>
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-card">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">30-Day Plan</span>
            <span className="sm:hidden">Plan</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="resume"><ImprovedResume text={data.improvedResume} /></TabsContent>
          <TabsContent value="gaps"><SkillGaps gaps={data.skillGaps} /></TabsContent>
          <TabsContent value="careers"><CareerSuggestions suggestions={data.careerSuggestions} /></TabsContent>
          <TabsContent value="roadmap"><Roadmap phases={data.roadmap} /></TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
