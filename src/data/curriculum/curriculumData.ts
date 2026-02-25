export type CurriculumChapter = {
  id: string; // e.g., "orientation", "discovery", "strategy"
  title: string;
  subtitle: string;
  metaphor: {
    title: string;
    description: string;
    imageAsset: string; // URL to the generated asset
  };
  subConcepts: { id: string; name: string }[];
  fullMarkdown: string; // The raw markdown text
};

// Use Vite's import.meta.glob to synchronously load raw markdown contents at transpilation time
// The query '?raw' ensures vite loads it as a string
const mdFiles = import.meta.glob('../../../MD/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// Helper function to safely get markdown content
const getMd = (filename: string): string => {
  const content = mdFiles[`../../../MD/${filename}`];
  if (!content) {
    console.warn(`[curriculumData] Markdown file not found in build: ${filename}`);
    return `\n\n> ⚠️ Data Missing: ${filename} 파일이 MD 폴더에 존재하지 않습니다.\n\n`;
  }
  return content;
};

export const curriculumData: CurriculumChapter[] = [
  {
    id: "orientation",
    title: "Chapter 1. 입문 (Orientation)",
    subtitle: "PM 역할의 범위, 학습 로드맵, 기본 용어를 이해합니다.",
    metaphor: {
      title: "지도를 펼치는 출발실 (Map Room)",
      description: "PM은 식당의 매니저와 같아요. 요리사(개발자)가 요리를 잘하게 돕고, 웨이터(디자이너)가 예쁘게 서빙하게 조율하며, 결국 손님(사용자)이 맛있게 먹고 계산(비즈니스 가치)하게 만드는 사람이죠.",
      imageAsset: "/generated/map_room.svg"
    },
    subConcepts: [
      { id: 'ori-1', name: 'PM이 하는 일' },
      { id: 'ori-2', name: 'Mini-CEO의 함정' },
      { id: 'ori-3', name: '다면적 소통' }
    ],
    fullMarkdown: getMd('ABOUT PM.md') + "\n\n---\n\n" + getMd('aboutPm_gpt.md')
  },
  {
    id: "discovery",
    title: "Chapter 2. 문제탐색 (Discovery)",
    subtitle: "사용자와 시장의 신호를 모아 진짜 문제를 정의합니다.",
    metaphor: {
      title: "단서를 모으는 탐정 책상 (Detective Desk)",
      description: "진짜 문제는 '아프다'고 할 때 반창고를 붙여주는 게 아니라, 왜 넘어졌는지(돌부리)를 직접 눈으로 확인하고 그 돌부리를 치워주는 탐정(Detective) 놀이예요.",
      imageAsset: "/generated/detective_desk.svg"
    },
    subConcepts: [
      { id: 'disc-1', name: '진짜 문제 식별' },
      { id: 'disc-2', name: '5 Whys 기법' },
      { id: 'disc-3', name: 'MVP 철학' }
    ],
    fullMarkdown: getMd('pm.md')
  },
  {
    id: "strategy",
    title: "Chapter 3. 전략 및 BM (Strategy)",
    subtitle: "비즈니스 모델과 성능 지표를 연결해 의사결정 기준을 세웁니다.",
    metaphor: {
      title: "정교한 톱니바퀴 (Precision Gears)",
      description: "우리가 만든 레고(제품)를 친구들에게 어떻게 빌려주고(구독), 어떤 친구는 공짜로 쓰게 하되 스티커를 팔아서(프리미엄) 용돈을 벌지 정하는 똑똑한 장사 규칙이에요.",
      imageAsset: "/generated/precision_gears.svg"
    },
    subConcepts: [
      { id: 'strat-1', name: '비즈니스 모델 캔버스' },
      { id: 'strat-2', name: 'LTV와 CAC 방정식' },
      { id: 'strat-3', name: 'SaaS 구독 모델' }
    ],
    fullMarkdown: getMd('디지털 프로덕트의 지속 가능한 성장을 위한 비즈니스 모델 설계 가이드.md')
  },
  {
    id: "execution",
    title: "Chapter 4. 논리 및 구조 설계 (Execution)",
    subtitle: "요구사항을 기능과 흐름으로 번역해 제품 뼈대를 만듭니다.",
    metaphor: {
      title: "설계도를 그리는 블루프린트 (Blueprint)",
      description: "건물을 지을 때 벽돌부터 쌓는 게 아니라, 아주 큰 백지에 '여긴 안방, 여긴 화장실'이라고 명확한 선을 그어주는(지도 그리기) 과정이에요.",
      imageAsset: "/generated/blueprint.svg"
    },
    subConcepts: [
      { id: 'exec-1', name: '유저 플로우(User Flow)' },
      { id: 'exec-2', name: 'Lo-Fi 와이어프레임' },
      { id: 'exec-3', name: '인포메이션 아키텍처' }
    ],
    fullMarkdown: getMd('기획.md')
  },
  {
    id: "growth",
    title: "Chapter 5. 성장최적화 (Growth)",
    subtitle: "측정과 개선을 반복하는 사용자 지표 개선 사이클을 운영합니다.",
    metaphor: {
      title: "측정과 개선을 반복하는 온실 (Greenhouse)",
      description: "식물을 키우면서 물을 많이 줘볼까(A방법)? 햇빛을 더 보여줄까(B방법)? 하고 매일 자로 키를 재며 가장 잘 자라는 환경(온실)을 찾는 재미있는 실험입니다.",
      imageAsset: "/generated/data_greenhouse.svg"
    },
    subConcepts: [
      { id: 'grow-1', name: 'AARRR 퍼널 분석' },
      { id: 'grow-2', name: '리텐션 최적화' },
      { id: 'grow-3', name: 'A/B 테스트 설계' }
    ],
    fullMarkdown: getMd('[시니어 PM의 마스터클래스] 제품의 탄생부터 성장까지_ 프로덕트 매니지먼트의 모든 것.md') + "\n\n---\n\n" + getMd('PM 마스터클래스 교재화 심층 리서치.md')
  },
  {
    id: "leadership",
    title: "Chapter 6. 리더십 (Leadership)",
    subtitle: "커뮤니케이션과 영향력을 통해 조직 정렬을 만듭니다.",
    metaphor: {
      title: "방향을 맞추는 든든한 다리 (Bridge Deck)",
      description: "팀이라는 큰 배에서 열심히 노를 젓는 선원(팀원)들이 서로 부딪히거나 지치지 않도록, 다 같이 한 목소리로 구령을 맞추게 도와주는 든든한 북치기(항해사)예요.",
      imageAsset: "/generated/bridge_deck.svg"
    },
    subConcepts: [
      { id: 'lead-1', name: '권한 없는 리더십' },
      { id: 'lead-2', name: '스펙아웃(Spec-Out)' },
      { id: 'lead-3', name: '개발자와의 통역' }
    ],
    fullMarkdown: getMd('Club Info.md')
  },
  {
    id: "agile",
    title: "Chapter 7. 실행과 통제 (Agile)",
    subtitle: "개발을 진행시키는 우선순위 결정과 조직 운영의 실무를 다룹니다.",
    metaphor: {
      title: "일정을 맞추는 관제탑 (Control Tower)",
      description: "비행기들이 하늘에서 부딪히지 않고 제시간에 무사히 이착륙할 수 있도록, 순서를 정해주고 날씨(위험)를 미리 알려주는 아주 똑똑한 관제사 역할이에요.",
      imageAsset: "/generated/control_tower.svg"
    },
    subConcepts: [
      { id: 'agile-1', name: '백로그와 RICE' },
      { id: 'agile-2', name: '스프린트와 데일리' },
      { id: 'agile-3', name: '회고와 블레임리스' }
    ],
    fullMarkdown: getMd('Chapter7_Agile.md')
  },
  {
    id: "data-ai",
    title: "Chapter 8. 데이터 엔진과 AI (Future)",
    subtitle: "데이터 리터러시와 AI를 무기로 삼는 미래 시프트 전략입니다.",
    metaphor: {
      title: "미래를 여는 만능 나침반 (Magic Compass)",
      description: "캄캄한 바다에서 사람들이 어디로 가야 할지 헤맬 때, 반짝이는 별빛(데이터)과 요술 거울(AI)을 합쳐서 가장 빠르고 안전한 보물섬 길을 찾아주는 마법의 도구랍니다.",
      imageAsset: "/generated/magic_compass.svg"
    },
    subConcepts: [
      { id: 'data-1', name: '리터러시와 로깅' },
      { id: 'data-2', name: '도메인과 판단력' },
      { id: 'data-3', name: '역발상 프롬프트' }
    ],
    fullMarkdown: getMd('Chapter8_Data_AI.md')
  }
];
