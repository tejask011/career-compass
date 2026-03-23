export interface RecommendedResource {
  title: string;
  type: "video" | "article" | "course" | "other";
  url: string;
}

export interface SkillGap {
  skill: string;
  importance: "high" | "medium" | "low";
  reason: string;
  recommendedResources?: RecommendedResource[];
}

export interface Company {
  name: string;
  url: string;
}

export interface CareerSuggestion {
  role: string;
  match: number;
  reason: string;
  skills: string[];
  companies?: Company[];
}

export interface RoadmapPhase {
  day: string;
  title: string;
  tasks: string[];
  timeEstimate: string;
}

export interface AnalysisResult {
  improvedResume: string;
  skillGaps: SkillGap[];
  careerSuggestions: CareerSuggestion[];
  roadmap: RoadmapPhase[];
}
