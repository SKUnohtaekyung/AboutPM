export type ContentSource = "md-folder" | "root-fallback";

export type SectionItem = {
  id: string;
  title: string;
  body: string;
  summary: string;
  keywords: string[];
  wordCount: number;
  order: number;
};

export type DocItem = {
  id: string;
  slug: string;
  title: string;
  path: string;
  raw: string;
  summary: string;
  headings: string[];
  readingMinutes: number;
  source: ContentSource;
  sections: SectionItem[];
  totalWords: number;
};

export type StageId =
  | "orientation"
  | "discovery"
  | "strategy"
  | "execution"
  | "growth"
  | "leadership";

export type StageMeta = {
  id: StageId;
  title: string;
  metaphor: string;
  objective: string;
  animationKeyword: string;
  visual: string;
};

export type LearningCard = {
  id: string;
  stageId: StageId;
  title: string;
  summary: string;
  analogy: string;
  lesson: string;
  checkpoint: string;
  keyPoints: string[];
  termTags: string[];
  sourceDoc: string;
  sourceSection: string;
  sourcePath: string;
  visual: string;
  animationKeyword: string;
};
