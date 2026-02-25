import type { DocItem, LearningCard, StageId, StageMeta } from "../types";

export const STAGES: StageMeta[] = [
  {
    id: "orientation",
    title: "입문(Orientation)",
    metaphor: "지도를 펼치는 출발실(Map Room)",
    objective: "PM 역할의 범위, 학습 로드맵, 기본 용어를 이해합니다.",
    animationKeyword: "Split Text Stagger",
    visual: "/generated/stage-orientation.svg"
  },
  {
    id: "discovery",
    title: "문제탐색(Discovery)",
    metaphor: "단서를 모으는 탐정 책상(Detective Desk)",
    objective: "사용자와 시장의 신호를 모아 문제를 정의합니다.",
    animationKeyword: "Hover Image Reveal",
    visual: "/generated/stage-discovery.svg"
  },
  {
    id: "strategy",
    title: "전략수립(Strategy)",
    metaphor: "우선순위를 조정하는 관제탑(Control Tower)",
    objective: "비즈니스 모델과 지표를 연결해 의사결정 기준을 세웁니다.",
    animationKeyword: "SVG Path Drawing (Stroke Dashoffset)",
    visual: "/generated/stage-strategy.svg"
  },
  {
    id: "execution",
    title: "실행관리(Execution)",
    metaphor: "설계를 제품으로 바꾸는 작업장(Workshop)",
    objective: "요구사항을 기능과 일정으로 번역해 팀 실행을 관리합니다.",
    animationKeyword: "Accordion Gallery",
    visual: "/generated/stage-execution.svg"
  },
  {
    id: "growth",
    title: "성장최적화(Growth)",
    metaphor: "측정과 개선을 반복하는 온실(Greenhouse)",
    objective: "활성화, 유지, 수익화 지표를 바탕으로 개선 사이클을 운영합니다.",
    animationKeyword: "Pin & Scale (Immersive Zoom)",
    visual: "/generated/stage-growth.svg"
  },
  {
    id: "leadership",
    title: "리더십(Leadership)",
    metaphor: "여러 팀의 방향을 맞추는 함교(Bridge Deck)",
    objective: "커뮤니케이션과 영향력을 통해 조직 정렬을 만듭니다.",
    animationKeyword: "Theme Transition (Background Color Swap)",
    visual: "/generated/stage-leadership.svg"
  }
];

type CoverageByDoc = {
  docTitle: string;
  docPath: string;
  sectionCount: number;
  includedCount: number;
  totalWords: number;
};

export type CurriculumResult = {
  cards: LearningCard[];
  coverage: CoverageByDoc[];
  stageCounts: Record<StageId, number>;
  animationKeywords: string[];
};

const STAGE_KEYWORDS: Record<StageId, string[]> = {
  orientation: [
    "about",
    "소개",
    "기본",
    "입문",
    "개요",
    "커리큘럼",
    "pm",
    "직무",
    "역할",
    "정의"
  ],
  discovery: ["탐색", "문제", "사용자", "시장", "리서치", "분석", "가설", "인사이트", "pain", "insight"],
  strategy: ["전략", "우선순위", "지표", "kpi", "비즈니스", "모델", "포지셔닝", "수익", "roadmap", "metric"],
  execution: ["실행", "기획", "요구사항", "개발", "협업", "출시", "실험", "delivery", "spec", "launch"],
  growth: ["성장", "활성화", "유지", "리텐션", "전환", "수익화", "퍼널", "churn", "retention", "growth"],
  leadership: ["리더십", "커뮤니케이션", "이해관계자", "협업", "조율", "영향력", "stakeholder", "influence"]
};

const STAGE_ANALOGY: Record<StageId, string> = {
  orientation: "여행 전에 노선도를 먼저 읽는 단계입니다.",
  discovery: "증거를 모아 사건의 원인을 찾는 탐정 단계입니다.",
  strategy: "여러 비행기의 착륙 순서를 정하는 관제 단계입니다.",
  execution: "설계도를 실제 제품으로 만드는 공정 단계입니다.",
  growth: "생육 상태를 보며 가지치기하는 재배 단계입니다.",
  leadership: "여러 갑판 팀의 방향을 맞추는 항해 단계입니다."
};

const KNOWN_ANIMATIONS = [
  "Lenis Smooth Scroll",
  "Cinematic Preloader",
  "Custom Magnetic Cursor",
  "Grain Noise Overlay",
  "Floating Dock Nav",
  "Mask Reveal (Clip-Path Animation)",
  "Theme Transition (Background Color Swap)",
  "3D Rolling Text (Perspective Rotate)",
  "SVG Path Drawing (Stroke Dashoffset)",
  "Text Reveal (Background Clip)",
  "Split Text Stagger",
  "Explode Gallery (Scatter Effect)",
  "Velocity Skew (Physics Distortion)",
  "Pin & Scale (Immersive Zoom)",
  "Accordion Gallery",
  "Hover Image Reveal",
  "Holo-Card (3D Tilt Effect)",
  "Gravity Physics (Physics Engine)",
  "Interactive Water Ripple",
  "Particle Text Disperse",
  "Constellation Network",
  "Generative Flow Field",
  "RGB Kinetic Typography"
];

const TERM_TRANSLATIONS: Record<string, string> = {
  pm: "프로덕트 매니저(Product Manager)",
  product: "제품(Product)",
  problem: "문제(Problem)",
  user: "사용자(User)",
  insight: "인사이트(Insight)",
  research: "리서치(Research)",
  metric: "지표(Metric)",
  kpi: "핵심성과지표(KPI)",
  roadmap: "로드맵(Roadmap)",
  strategy: "전략(Strategy)",
  execution: "실행(Execution)",
  growth: "성장(Growth)",
  retention: "유지율(Retention)",
  churn: "이탈률(Churn)",
  experiment: "실험(Experiment)",
  launch: "출시(Launch)",
  stakeholder: "이해관계자(Stakeholder)",
  business: "비즈니스(Business)",
  model: "모델(Model)",
  가치: "가치(Value)",
  시장: "시장(Market)",
  사용자: "사용자(User)",
  문제: "문제(Problem)",
  전략: "전략(Strategy)",
  지표: "지표(Metric)",
  성장: "성장(Growth)",
  실행: "실행(Execution)",
  협업: "협업(Collaboration)",
  실험: "실험(Experiment)"
};

const STAGE_LESSON_TEMPLATE: Record<StageId, (a: string, b: string, c: string) => string> = {
  orientation: (a, b, c) =>
    `${a}와 ${b}를 중심으로 PM 기본 구조를 정리하고, ${c} 관점에서 학습 방향을 고정합니다.`,
  discovery: (a, b, c) =>
    `${a} 신호를 모으고 ${b}를 검증해 핵심 ${c}를 식별하는 탐색 루틴을 만듭니다.`,
  strategy: (a, b, c) =>
    `${a} 기준으로 우선순위를 세우고 ${b}와 ${c}를 연결해 실행 가능한 전략으로 전환합니다.`,
  execution: (a, b, c) =>
    `${a}를 명확히 쪼개고 ${b} 단위로 협업하며 ${c} 기준으로 배포 품질을 관리합니다.`,
  growth: (a, b, c) =>
    `${a} 지표를 추적하고 ${b} 실험을 반복해 ${c} 개선 루프를 빠르게 돌립니다.`,
  leadership: (a, b, c) =>
    `${a} 정렬을 우선하고 ${b} 설득 구조를 갖춰 ${c} 의사결정을 조직 단위로 확장합니다.`
};

const STAGE_CHECKPOINT_TEMPLATE: Record<StageId, string> = {
  orientation: "핵심 용어를 자신의 문장으로 설명할 수 있는지 점검합니다.",
  discovery: "문제 정의 문장이 사용자 맥락과 연결되는지 확인합니다.",
  strategy: "우선순위 기준과 지표 연동이 문서로 명확한지 확인합니다.",
  execution: "요구사항과 일정, 책임자 연결이 누락 없이 정리됐는지 확인합니다.",
  growth: "실험 가설과 성공/실패 기준이 사전에 정의됐는지 확인합니다.",
  leadership: "이해관계자별 메시지와 의사결정 로그가 정렬됐는지 확인합니다."
};

function toLower(input: string): string {
  return input.toLowerCase();
}

function normalizeTerm(term: string): string {
  const cleaned = term.trim().toLowerCase();
  if (!cleaned) return "핵심 개념(Core Concept)";
  return TERM_TRANSLATIONS[cleaned] ?? `${term}(Term)`;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function pickVisual(stageId: StageId): string {
  return STAGES.find((stage) => stage.id === stageId)?.visual ?? "/generated/stage-orientation.svg";
}

function pickStageAnimation(stageId: StageId): string {
  return STAGES.find((stage) => stage.id === stageId)?.animationKeyword ?? "Text Reveal (Background Clip)";
}

function getQuantileStage(position: number): StageId {
  if (position < 0.16) return "orientation";
  if (position < 0.33) return "discovery";
  if (position < 0.5) return "strategy";
  if (position < 0.68) return "execution";
  if (position < 0.84) return "growth";
  return "leadership";
}

function classifyStage(text: string, title: string, position: number): StageId {
  const corpus = `${title} ${text}`.toLowerCase();
  let best: StageId | null = null;
  let bestScore = 0;

  for (const stage of STAGES) {
    const score = STAGE_KEYWORDS[stage.id].reduce((acc, keyword) => acc + (corpus.includes(keyword) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = stage.id;
    }
  }

  if (best && bestScore > 0) return best;
  return getQuantileStage(position);
}

function toCardTitle(sectionTitle: string, fallback: string): string {
  const title = sectionTitle.trim();
  if (!title) return fallback;
  return title.length > 44 ? `${title.slice(0, 44)}...` : title;
}

function getTermsFromSectionKeywords(sectionKeywords: string[]): string[] {
  const terms = unique(sectionKeywords.map(normalizeTerm));
  if (terms.length >= 3) return terms.slice(0, 3);
  const defaults = [
    "문제정의(Problem Framing)",
    "우선순위(Prioritization)",
    "검증(Validation)"
  ];
  return unique([...terms, ...defaults]).slice(0, 3);
}

function summarizeCard(stageId: StageId, sectionKeywords: string[]): {
  summary: string;
  lesson: string;
  checkpoint: string;
  points: string[];
  tags: string[];
} {
  const [a, b, c] = getTermsFromSectionKeywords(sectionKeywords);
  const summary = STAGE_LESSON_TEMPLATE[stageId](a, b, c);
  const lesson = `${a} -> ${b} -> ${c} 흐름으로 판단 근거를 연결합니다.`;
  const checkpoint = STAGE_CHECKPOINT_TEMPLATE[stageId];
  const points = [
    `${a} 관점에서 현재 과제를 한 문장으로 정의합니다.`,
    `${b} 기준으로 실행 우선순위를 비교합니다.`,
    `${c} 결과를 다음 학습 루프의 입력값으로 사용합니다.`
  ];

  return {
    summary,
    lesson,
    checkpoint,
    points,
    tags: [a, b, c]
  };
}

function pickAnimationDocText(docs: DocItem[]): string {
  const animationDoc = docs.find((doc) => toLower(doc.title).includes("animation"));
  return animationDoc?.raw ?? "";
}

function extractAvailableAnimations(docs: DocItem[]): string[] {
  const animationText = toLower(pickAnimationDocText(docs));
  if (!animationText) return KNOWN_ANIMATIONS.slice(0, 10);

  const hits = KNOWN_ANIMATIONS.filter((item) => {
    const base = item.split("(")[0].trim().toLowerCase();
    return animationText.includes(base);
  });

  return hits.length > 0 ? hits : KNOWN_ANIMATIONS.slice(0, 10);
}

export function buildCurriculum(docs: DocItem[]): CurriculumResult {
  const allSections = docs.flatMap((doc) =>
    doc.sections.map((section) => ({
      doc,
      section
    }))
  );

  const total = Math.max(1, allSections.length);

  const cards: LearningCard[] = allSections.map(({ doc, section }, index) => {
    const position = index / total;
    const stageId = classifyStage(section.body, section.title, position);
    const rewritten = summarizeCard(stageId, section.keywords);

    return {
      id: `${doc.id}:${section.id}`,
      stageId,
      title: toCardTitle(section.title, `${doc.title} 섹션 ${section.order}`),
      summary: rewritten.summary,
      analogy: STAGE_ANALOGY[stageId],
      lesson: rewritten.lesson,
      checkpoint: rewritten.checkpoint,
      keyPoints: rewritten.points,
      termTags: rewritten.tags,
      sourceDoc: doc.title,
      sourceSection: section.title,
      sourcePath: doc.path,
      visual: pickVisual(stageId),
      animationKeyword: pickStageAnimation(stageId)
    };
  });

  const stageCounts = STAGES.reduce<Record<StageId, number>>(
    (acc, stage) => ({ ...acc, [stage.id]: 0 }),
    {
      orientation: 0,
      discovery: 0,
      strategy: 0,
      execution: 0,
      growth: 0,
      leadership: 0
    }
  );

  for (const card of cards) {
    stageCounts[card.stageId] += 1;
  }

  const coverage: CoverageByDoc[] = docs.map((doc) => ({
    docTitle: doc.title,
    docPath: doc.path,
    sectionCount: doc.sections.length,
    includedCount: doc.sections.length,
    totalWords: doc.totalWords
  }));

  return {
    cards,
    coverage,
    stageCounts,
    animationKeywords: extractAvailableAnimations(docs)
  };
}
