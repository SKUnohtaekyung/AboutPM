# PM Learning Frontend Refactoring Plan

작성일: 2026-07-01  
대상 프로젝트: `pm-learning-frontend-site`  
현재 앱 유형: Vite + React + TypeScript 기반 PM 학습 인터랙티브 웹앱

## 1. 문서 목적

이 문서는 현재 프로젝트의 리팩토링 계획과 진행 상태를 기록한다.

목표는 기능을 새로 추가하는 것이 아니라, 현재 동작을 보존하면서 다음 문제를 단계적으로 줄이는 것이다.

- `App.tsx`에 집중된 화면/애니메이션/렌더링 책임 분리
- `curriculumData.ts`에 포함된 대량 마크다운 본문으로 인한 초기 번들 비대화 완화
- 콘텐츠 원본과 앱 런타임 데이터의 경계 명확화
- 스타일, 유틸, 생성 스크립트의 책임 정리
- 이후 변경을 안전하게 검증할 수 있는 최소 검증 체계 마련

## 2. 현재 구조 요약

현재 프로젝트는 단일 페이지 앱이다.

핵심 흐름:

1. `index.html`이 React root를 제공한다.
2. `src/main.tsx`가 `App`을 렌더링한다.
3. `src/App.tsx`가 허브 화면과 챕터 상세 화면을 전환한다.
4. 허브 화면은 3D 지식 그래프를 보여준다.
5. 노드 클릭 시 해당 챕터 상세 화면으로 전환한다.
6. 상세 화면은 챕터별 마크다운 본문을 `ReactMarkdown`으로 렌더링한다.

주요 파일:

```text
src/
├─ App.tsx
├─ main.tsx
├─ styles.css
├─ data/
│  └─ curriculum/
│     ├─ curriculumData.ts
│     └─ lessons/
│        └─ ch-xx-ls-xx.md
├─ lib/
│  ├─ content.ts
│  ├─ curriculum.ts
│  └─ storage.ts
└─ types.ts
```

정적 자산:

```text
public/
├─ main.png
├─ sub.png
├─ favicon.svg
└─ generated/
   └─ stage/inline/illustration assets
```

콘텐츠 원본 후보:

```text
MD/
src/data/curriculum/lessons/
src/data/curriculum/curriculumData.ts
curriculumPlanner.json
```

## 3. 리팩토링 원칙

### 3.1 동작 보존 우선

각 phase는 가능한 한 작게 나누고, 한 phase 안에서는 기능 변경과 구조 변경을 섞지 않는다.

Phase 1은 구조 분리만 수행했다.  
Phase 2부터는 데이터 로딩 방식이 바뀌므로 더 엄격한 검증이 필요하다.

### 3.2 런타임 경로와 생성 경로 분리

앱 실행 중 실제로 import되는 코드는 `src/` 안에서 명확히 유지한다.  
콘텐츠 생성용 스크립트나 원자료 가공 로직은 `scripts/` 또는 별도 문서에서 목적을 구분한다.

### 3.3 콘텐츠는 필요한 시점에 로드

초기 허브 화면에서 모든 챕터의 본문 마크다운을 다운로드하지 않도록 한다.  
챕터 상세 진입 시 해당 챕터 본문만 가져오는 방향을 목표로 한다.

### 3.4 검증 가능한 단계로 진행

각 phase 완료 조건에는 최소한 다음 중 일부가 포함되어야 한다.

- `npm run build`
- 로컬 서버 HTTP 200 확인
- 허브 화면 진입 확인
- 노드 클릭 후 챕터 상세 진입 확인
- 뒤로가기 확인
- 마크다운 이미지 렌더링 확인
- 빌드 결과 번들 크기 비교

## 4. 기준선 기록

Phase 1 직전/직후 확인된 빌드 기준:

```text
npm run build
```

Phase 1 완료 후 빌드 결과:

```text
dist/index.html                 0.56 kB │ gzip:   0.49 kB
dist/assets/index-BEUvdgGd.css  9.18 kB │ gzip:   2.60 kB
dist/assets/index-260ZWIVQ.js   1,901.89 kB │ gzip: 592.64 kB
```

Vite 경고:

```text
Some chunks are larger than 500 kB after minification.
```

해석:

- Phase 1은 파일 책임 분리 단계이므로 번들 크기 감소를 목표로 하지 않았다.
- chunk size 경고가 남아 있는 것은 예상된 상태다.
- 이 경고는 Phase 2와 Phase 5에서 본격적으로 다룬다.

로컬 서버 확인:

```text
http://127.0.0.1:5173/
StatusCode: 200
Title: PM Learning Studio
```

## 5. Phase 1 완료 기록

상태: 완료  
완료일: 2026-07-01  
목표: `App.tsx`에 집중된 책임을 컴포넌트, 훅, 타입으로 분리한다.

### 5.1 Phase 1 이전 문제

기존 `src/App.tsx`는 다음 책임을 모두 포함하고 있었다.

- 앱 루트 상태 관리
- 허브/상세 화면 전환
- Lenis smooth scroll 초기화
- 3D 네트워크 그래프 데이터 생성
- 3D 노드 렌더링
- force graph resize 처리
- force graph click 처리
- GSAP ScrollTrigger 등록
- 챕터 상세 레이아웃
- 스크롤 진행률 상태 관리
- 마크다운 렌더링
- 뒤로가기 버튼 UI

이 구조는 초기 개발에는 빠르지만, 이후 변경 시 다음 문제가 생긴다.

- 한 파일의 수정 범위가 너무 커진다.
- 허브 화면 변경과 상세 화면 변경이 같은 파일에서 충돌한다.
- 애니메이션 로직과 UI 구조가 강하게 결합된다.
- Phase 2의 데이터 로딩 변경을 적용하기 전에 상세 화면 경계를 잡기 어렵다.

### 5.2 Phase 1에서 수행한 작업

`App.tsx`를 앱 루트 역할만 하도록 축소했다.

현재 `App.tsx`의 책임:

- `activeChapterId` 상태 관리
- 허브 화면과 상세 화면 전환
- `useLenisScroll()` 호출
- `NetworkGraphView`와 `ChapterDetail` 연결

추가된 컴포넌트:

```text
src/components/
├─ NetworkGraphView.tsx
├─ ChapterDetail.tsx
├─ ChapterBackButton.tsx
└─ MarkdownContent.tsx
```

추가된 훅:

```text
src/hooks/
├─ useLenisScroll.ts
├─ useWindowSize.ts
└─ useChapterScrollProgress.ts
```

추가된 타입:

```text
src/types/
└─ graph.ts
```

### 5.3 파일별 책임

#### `src/App.tsx`

역할:

- 앱의 최상위 화면 전환 컨테이너
- 허브 상태와 상세 상태를 결정
- 선택된 챕터를 `ChapterDetail`로 전달

남기지 않은 책임:

- 3D 그래프 구현
- 마크다운 렌더링
- GSAP ScrollTrigger 세부 구현
- window resize 구현

#### `src/components/NetworkGraphView.tsx`

역할:

- `curriculumData`를 기반으로 3D 그래프 노드/링크 생성
- `react-force-graph-3d` 렌더링
- 노드 클릭 시 카메라 이동 후 챕터 선택 콜백 실행
- Three.js sphere 및 SpriteText 생성

현재 보존된 동작:

- 중앙 허브 노드
- 챕터 노드
- 레슨/서브 컨셉 노드
- 링크 거리 조정
- 모바일/데스크톱 그래프 크기 분기

#### `src/components/ChapterDetail.tsx`

역할:

- 챕터 상세 화면 레이아웃
- 왼쪽 고정 패널
- 진행률 표시
- 비유 블록 렌더링
- 마크다운 본문 렌더링을 `MarkdownContent`에 위임

현재 보존된 동작:

- 뒤로가기
- 챕터 제목/부제 표시
- 스크롤 진행률 표시
- 마크다운 렌더링
- 챕터 metaphor 이미지 표시

#### `src/components/ChapterBackButton.tsx`

역할:

- 모바일/데스크톱 뒤로가기 버튼의 중복 구조 제거
- `ChevronLeft` 아이콘 포함

#### `src/components/MarkdownContent.tsx`

역할:

- `ReactMarkdown` + `remark-gfm` 렌더링 경계 제공
- Phase 2에서 markdown loading 상태와 결합될 가능성이 있음

#### `src/hooks/useLenisScroll.ts`

역할:

- Lenis smooth scroll 초기화
- requestAnimationFrame lifecycle 관리
- unmount 시 Lenis destroy 및 animation frame cleanup

기존 대비 개선점:

- 기존에는 cleanup에서 `requestAnimationFrame` 취소가 없었다.
- 현재는 `cancelAnimationFrame(frameId)`를 호출한다.

#### `src/hooks/useWindowSize.ts`

역할:

- `window.innerWidth`, `window.innerHeight` 상태 관리
- resize listener 등록/해제

#### `src/hooks/useChapterScrollProgress.ts`

역할:

- GSAP ScrollTrigger 등록
- desktop에서 왼쪽 패널 pin 처리
- scroll progress 상태 계산

#### `src/types/graph.ts`

역할:

- 3D 그래프 노드/링크 타입 정의

### 5.4 Phase 1 검증 결과

빌드:

```text
npm run build
```

결과:

```text
성공
```

로컬 서버:

```text
http://127.0.0.1:5173/
```

결과:

```text
HTTP 200
Title: PM Learning Studio
```

남은 확인 권장 항목:

- 브라우저에서 허브 화면 시각 확인
- 3D 그래프 노드 클릭 확인
- 챕터 상세 진입 확인
- 뒤로가기 확인
- 상세 화면 스크롤 진행률 확인

### 5.5 Phase 1 후 주의사항

현재 작업 전부터 존재하던 변경:

```text
M tsconfig.node.tsbuildinfo
M vite.config.js
?? .agents/logs/
```

Phase 1 작업/검증 과정에서 갱신된 항목:

```text
M src/App.tsx
?? src/components/
?? src/hooks/
?? src/types/
M tsconfig.app.tsbuildinfo
```

주의:

- `tsconfig.*.tsbuildinfo`는 빌드 과정에서 갱신되는 산출물이다.
- 커밋 시 포함할지 여부를 별도로 결정하는 것이 좋다.
- `.agents/logs/`는 로컬 실행 로그이므로 일반적으로 커밋 대상에서 제외하는 것이 안전하다.

## 6. Phase 2 계획: 커리큘럼 본문 Lazy Loading

상태: 완료  
목표: `curriculumData.ts`에 포함된 `fullMarkdown` 본문을 메인 번들에서 분리한다.

### 6.1 현재 문제

`src/data/curriculum/curriculumData.ts`는 챕터 메타데이터와 본문 마크다운을 함께 포함한다.

현재 문제점:

- `fullMarkdown`이 메인 JS 번들에 포함된다.
- 사용자가 첫 화면인 3D 허브만 보더라도 모든 챕터 본문을 다운로드한다.
- `curriculumData.ts` 파일이 커져서 리뷰와 수정이 어렵다.
- `lessons/*.md` 파일이 존재하지만 런타임에서는 `fullMarkdown` 중심으로 동작한다.

확인된 사실:

- 빌드된 JS 안에서 `실무 적용 체크리스트`, `고객 인터뷰`, `Sean Ellis Test` 등 본문 문자열이 검색된다.
- 즉, 본문이 초기 JS에 포함되어 있다.

### 6.2 Phase 2 목표 상태

초기 허브 화면에서 필요한 데이터:

- 챕터 id
- 챕터 title/subtitle
- metaphor 정보
- subConcepts 목록
- lesson metadata
- content file path 또는 chapter markdown key

상세 화면 진입 후 필요한 데이터:

- 선택된 챕터의 markdown 본문

목표 구조 예시:

```text
src/data/curriculum/
├─ curriculumData.ts       # 메타데이터 중심
├─ markdownLoaders.ts      # markdown lazy loader
└─ lessons/
   ├─ ch-01-ls-01.md
   ├─ ch-01-ls-02.md
   └─ ...
```

또는 챕터 단위 병합을 택할 경우:

```text
src/data/curriculum/
├─ curriculumData.ts
├─ chapterMarkdownLoaders.ts
└─ chapters/
   ├─ ch-01.md
   ├─ ch-02.md
   └─ ...
```

### 6.3 구현 옵션

#### 옵션 A: 기존 레슨 마크다운 파일을 그대로 사용

방식:

- `src/data/curriculum/lessons/*.md`를 `?raw`로 동적 import
- 챕터 상세 진입 시 챕터에 포함된 lesson들의 md를 순서대로 로드
- 여러 md를 하나의 문자열로 join해서 기존 `ReactMarkdown`에 전달

장점:

- 이미 존재하는 `lessons/*.md`를 활용한다.
- 레슨 단위 수정이 쉽다.
- 한 레슨만 수정할 때 diff가 작다.

단점:

- 챕터 상세 진입 시 여러 파일을 로드해야 한다.
- 챕터별 full markdown과 레슨별 markdown 내용이 완전히 동일한지 검증이 필요하다.

#### 옵션 B: 챕터 단위 markdown 파일 생성

방식:

- `ch-01.md`, `ch-02.md`처럼 챕터별 통합 markdown 파일을 만든다.
- `ChapterDetail`은 선택된 챕터의 통합 md 한 개만 로드한다.

장점:

- 상세 화면 로딩이 단순하다.
- 기존 `fullMarkdown` 렌더링 방식과 가장 유사하다.

단점:

- 챕터별 md 생성/관리 규칙이 추가된다.
- 기존 `lessons/*.md`와 중복 가능성이 있다.

#### 권장안

1차로는 옵션 A를 우선 검토한다.

이유:

- 이미 `src/data/curriculum/lessons/*.md`가 존재한다.
- 각 lesson metadata에 `content_file` 값이 있다.
- 콘텐츠 원본을 레슨 단위로 유지하는 편이 장기적으로 관리하기 쉽다.

단, 실제 적용 전 다음을 확인해야 한다.

- `curriculumData.ts`의 `fullMarkdown` 내용과 `lessons/*.md` 내용이 같은지
- `content_file` 경로가 실제 파일 경로와 일관되는지
- 일부 챕터의 레슨 개수와 md 파일 개수가 일치하는지

### 6.4 Phase 2 세부 작업

#### 6.4.1 데이터 타입 분리

현재:

```ts
export interface CurriculumChapter {
  ...
  fullMarkdown: string;
}
```

목표:

```ts
export interface CurriculumChapter {
  ...
  fullMarkdown?: string; // 과도기
}
```

최종:

```ts
export interface CurriculumChapter {
  ...
  fullMarkdown 없음
}
```

과도기 전략:

- 1차 변경에서는 `fullMarkdown?`로 optional 처리한다.
- lazy loading이 안정화되면 `fullMarkdown` 필드를 제거한다.

#### 6.4.2 markdown loader 추가

예상 파일:

```text
src/data/curriculum/markdownLoaders.ts
```

예상 역할:

- `import.meta.glob("./lessons/*.md", { query: "?raw", import: "default" })` 또는 Vite raw import 사용
- lesson file path를 받아 markdown 문자열 반환
- 파일이 없을 때 명확한 에러 반환

예상 API:

```ts
export async function loadLessonMarkdown(contentFile: string): Promise<string>;
export async function loadChapterMarkdown(chapter: CurriculumChapter): Promise<string>;
```

#### 6.4.3 `ChapterDetail`에 비동기 로딩 상태 추가

현재:

```ts
const markdownText = chapter.fullMarkdown || `## Content missing for ${chapter.title}`;
```

목표:

- `loading`
- `error`
- `markdown`

상태 추가:

```ts
const [markdownText, setMarkdownText] = useState("");
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

렌더링:

- loading: 본문 영역에 로딩 상태 표시
- error: 실패 메시지와 fallback 표시
- success: `MarkdownContent` 렌더링

주의:

- 디자인 텍스트를 과하게 늘리지 않는다.
- 기존 CSS를 최대한 활용한다.
- Phase 2에서는 로딩 UI를 간단히 유지한다.

#### 6.4.4 `fullMarkdown` 번들 포함 제거 확인

빌드 후 다음 검색으로 확인한다.

```powershell
rg "Sean Ellis|고객 인터뷰|실무 적용 체크리스트" dist\assets -g "*.js" -n
```

기대 결과:

- 메인 JS chunk에서 대량 본문 문자열이 제거된다.
- lazy chunk에는 선택된 markdown이 포함될 수 있다.

주의:

- `import.meta.glob`을 eager로 쓰면 안 된다.
- `eager: true`를 사용하면 다시 메인 번들에 포함될 수 있다.

#### 6.4.5 번들 크기 비교

Phase 2 전:

```text
JS: 1,901.89 kB
gzip: 592.64 kB
```

Phase 2 후 기록할 항목:

- 메인 JS 파일 크기
- lazy markdown chunk 수
- gzip 크기
- Vite chunk warning 변화

### 6.5 Phase 2 위험 요소

위험 1: `content_file` 경로 불일치

대응:

- 적용 전 `curriculumData`의 `content_file` 값과 실제 파일 목록 비교

위험 2: 레슨별 md와 `fullMarkdown` 내용 불일치

대응:

- 첫 적용에서는 `fullMarkdown` fallback을 유지
- 1~2개 챕터를 비교 검증 후 전체 전환

위험 3: 상세 화면 진입 시 깜빡임

대응:

- loading 상태를 본문 영역 안에서만 처리
- 왼쪽 패널은 즉시 렌더링

위험 4: 이미지 경로 깨짐

대응:

- markdown 내부 `/generated/...` 경로가 기존과 동일하게 동작하는지 확인

위험 5: import glob 경로 처리 오류

대응:

- loader mapping을 명시적으로 테스트
- 없는 파일이면 chapter id와 content_file을 포함한 에러 메시지 생성

### 6.6 Phase 2 완료 기준

필수:

- `npm run build` 성공
- 허브 화면 진입
- 챕터 상세 진입 시 markdown 렌더링
- 뒤로가기 정상
- 본문 이미지 정상 표시
- 메인 JS에서 대량 markdown 본문 제거 확인

권장:

- 최소 2개 이상 챕터 상세 확인
- 레슨 여러 개를 가진 챕터 확인
- 단일 레슨 챕터 확인
- 없는 markdown file에 대한 fallback 확인

### 6.7 Phase 2 완료 기록

상태: 완료  
완료일: 2026-07-01

적용 방식:

- `src/data/curriculum/lessons/*.md`를 레슨 단위 lazy chunk로 로드한다.
- `import.meta.glob("./lessons/*.md", { query: "?raw", import: "default" })`를 lazy mode로 사용한다.
- `curriculumData.ts`의 `fullMarkdown` 필드를 제거했다.
- `ChapterDetail`은 더 이상 `chapter.fullMarkdown`을 읽지 않는다.
- 챕터 상세 진입 시 해당 챕터의 `lessons` 목록을 `order` 기준으로 정렬한 뒤 md 파일들을 로드하고 `---` 구분선으로 합쳐 렌더링한다.

추가된 파일:

```text
src/data/curriculum/markdownLoaders.ts
src/hooks/useChapterMarkdown.ts
```

수정된 파일:

```text
src/components/ChapterDetail.tsx
src/hooks/useChapterScrollProgress.ts
src/data/curriculum/curriculumData.ts
```

검증 결과:

```text
npm run build
```

결과:

```text
성공
```

Phase 2 후 빌드 결과:

```text
dist/index.html                      0.56 kB │ gzip:   0.48 kB
dist/assets/index-BEUvdgGd.css       9.18 kB │ gzip:   2.60 kB
dist/assets/index-s8Yu3iQF.js     1,786.54 kB │ gzip: 513.37 kB
```

비교:

```text
Phase 1 후 main JS: 1,901.89 kB │ gzip: 592.64 kB
Phase 2 후 main JS: 1,786.54 kB │ gzip: 513.37 kB
```

추가로 생성된 lazy chunk:

```text
31 lesson chunks
총 lesson chunk bytes: 245,964 bytes
```

본문 분리 확인:

- `dist/assets/index-*.js`에서 `Sean Ellis`, `실무 적용 체크리스트`, `진짜 사용자가 왜 그렇게 행동` 본문 검색 결과 없음
- 동일 문자열은 `dist/assets/ch-*.js` lesson chunk에서 확인됨

로컬 서버 확인:

```text
http://127.0.0.1:5173/
StatusCode: 200
Title: PM Learning Studio
```

남은 한계:

- 내장 브라우저 자동화 연결이 불가능해, Phase 2 후 실제 클릭 기반 UI 검증은 수행하지 못했다.
- 사용자는 Phase 1 후 UI를 직접 확인했고 이상이 없다고 보고했다.
- Phase 2 후에는 빌드/HTTP/번들 분리 검증까지 완료했다.

## 7. Phase 3 계획: 콘텐츠 원본 체계 정리

상태: 대기  
목표: 콘텐츠를 어디서 수정해야 화면에 반영되는지 명확히 한다.

### 7.1 현재 문제

콘텐츠 관련 파일이 여러 곳에 있다.

```text
MD/
src/data/curriculum/lessons/
src/data/curriculum/curriculumData.ts
curriculumPlanner.json
scripts/
```

문제:

- 원본 자료와 앱용 자료의 경계가 불명확하다.
- `scripts/`의 생성물이 무엇인지 명확히 문서화되어 있지 않다.
- 향후 콘텐츠 수정자가 어디를 고쳐야 하는지 혼동할 수 있다.

### 7.2 목표 상태

권장 원칙:

- 앱에서 직접 읽는 원본: `src/data/curriculum/lessons/*.md`
- 앱 메타데이터: `src/data/curriculum/curriculumData.ts` 또는 `curriculumMeta.ts`
- 보관/원자료: `MD/`
- 생성/보정 도구: `scripts/`

### 7.3 세부 작업

- `scripts/generate_curriculum.cjs` 역할 분석
- `scripts/create_planner.cjs` 역할 분석
- `curriculumPlanner.json`이 앱 런타임에서 쓰이는지 확인
- `MD/`를 archive/source-material로 문서화
- 콘텐츠 수정 규칙 작성
- 생성 스크립트를 계속 쓸지, 수동 관리로 단순화할지 결정

### 7.4 완료 기준

- 콘텐츠 수정 위치가 문서화되어 있다.
- 앱 런타임 데이터와 생성용 데이터가 구분되어 있다.
- 불필요한 중복 생성물이 정리 대상 목록에 올라와 있다.

## 8. Phase 4 계획: 스타일 구조 분리

상태: 대기  
목표: `src/styles.css`의 전역 스타일을 화면/역할 단위로 나눈다.

### 8.1 현재 문제

`src/styles.css`가 모든 화면 스타일을 포함한다.

문제:

- 허브 스타일과 상세 스타일이 섞여 있다.
- markdown 스타일과 앱 레이아웃 스타일이 같은 파일에 있다.
- 변경 시 영향 범위를 빠르게 파악하기 어렵다.

### 8.2 목표 구조

```text
src/styles/
├─ global.css
├─ hub.css
├─ graph.css
├─ chapter.css
└─ markdown.css
```

또는 CSS module을 도입하지 않고 단순 분리만 한다.

Phase 4에서는 기술 스택 변경을 피한다.  
CSS Modules, Tailwind, styled-components 같은 신규 도입은 하지 않는다.

### 8.3 세부 작업

- reset/global 변수 분리
- `.app-root`, `.abstract-bg` 등 앱 공통 스타일 분리
- `.toss-*` 허브 레이아웃 스타일 분리
- graph container 관련 스타일 분리
- `.chapter-*`, `.split-*`, `.progress-*` 상세 스타일 분리
- `.markdown-body` 스타일 분리

### 8.4 완료 기준

- UI 변화 없음
- `npm run build` 성공
- CSS import 순서가 명확함
- 스타일 수정 위치가 화면 단위로 예측 가능함

## 9. Phase 5 계획: 번들 최적화

상태: 대기  
목표: 초기 로딩 비용을 줄이고 Vite chunk size 경고를 완화한다.

### 9.1 현재 번들 이슈

Phase 1 후:

```text
JS: 1,901.89 kB
gzip: 592.64 kB
```

원인 후보:

- `three`
- `react-force-graph-3d`
- `gsap`
- `react-markdown`
- `remark-gfm`
- `curriculumData.ts`의 `fullMarkdown`

Phase 2에서 markdown 본문을 분리한 뒤에도 큰 라이브러리 chunk는 남을 수 있다.

### 9.2 최적화 방향

1. markdown 본문 lazy loading
2. `ChapterDetail` lazy loading
3. `ReactMarkdown` / `remark-gfm` 상세 chunk로 이동
4. GSAP가 상세 화면에서만 필요하다면 상세 chunk로 이동
5. 필요 시 `vite.config.ts`의 `manualChunks` 검토

### 9.3 주의

3D 허브가 첫 화면이므로 `three`와 force graph는 여전히 초기 chunk에 남을 가능성이 높다.  
만약 첫 화면에서도 3D 그래프 로딩을 지연시키려면 별도의 loading shell이 필요하다.

Phase 5에서는 사용자 경험을 해치지 않는 수준에서만 chunk를 나눈다.

### 9.4 완료 기준

- `npm run build` 성공
- 초기 JS chunk 감소
- 상세 화면 기능 정상
- chunk warning이 사라지거나, 남아도 이유가 명확히 문서화됨

## 10. Phase 6 계획: 미사용 코드 정리

상태: 대기  
목표: `src/lib`에 남은 코드의 런타임 의미를 명확히 한다.

### 10.1 현재 의심 지점

```text
src/lib/content.ts
src/lib/curriculum.ts
src/lib/storage.ts
```

현재 `App` 실행 경로에서는 직접 사용되지 않는 것으로 확인됐다.

### 10.2 정리 방향

각 파일을 다음 중 하나로 분류한다.

- 앱 런타임에서 사용
- 생성 스크립트로 이동
- 테스트/검증 도구로 이동
- 제거

### 10.3 파일별 검토 기준

#### `content.ts`

역할:

- `/MD/**/*.md`와 루트 markdown을 파싱하는 로직

검토:

- 현재 앱에서 실제로 쓰지 않는다면 `scripts/` 계층으로 이동하는 것이 자연스럽다.

#### `curriculum.ts`

역할:

- 문서 섹션을 학습 카드/스테이지로 변환하는 로직

검토:

- 런타임에서 쓰지 않는 생성 로직이라면 `scripts/` 또는 별도 generator로 이동한다.

#### `storage.ts`

역할:

- localStorage에 완료 문서 목록 저장

검토:

- 현재 완료 상태 UI가 없다면 죽은 코드일 수 있다.
- 향후 학습 완료 기능을 만들 계획이면 유지할 수 있다.

### 10.4 완료 기준

- `src/lib`에는 런타임에서 의미 있는 코드만 남는다.
- 생성용 코드는 `scripts/` 또는 문서화된 위치에 있다.
- 제거한 코드가 빌드에 영향 없음.

## 11. Phase 7 계획: 검증 체계 추가

상태: 대기  
목표: 리팩토링 후 기능 회귀를 빠르게 확인할 수 있는 기준을 만든다.

### 11.1 최소 검증 명령

현재 필수:

```text
npm run build
```

추가 검토:

```text
npm run lint
npm run test
npm run smoke
```

현재 프로젝트에는 lint/test 스크립트가 없으므로, 추가 여부는 별도 결정이 필요하다.

### 11.2 권장 smoke test

Playwright 또는 간단한 브라우저 자동화를 도입할 경우 확인할 흐름:

1. 앱 접속
2. title 확인
3. 허브 레이아웃 표시 확인
4. 노드 클릭 또는 상세 진입 트리거
5. 챕터 상세 제목 확인
6. 뒤로가기 클릭
7. 허브 복귀 확인

### 11.3 문서화

README 또는 별도 문서에 다음을 기록한다.

- 설치
- 개발 서버 실행
- 빌드
- 콘텐츠 수정 위치
- 커리큘럼 생성/수정 흐름
- 리팩토링 phase 상태

### 11.4 완료 기준

- 새 작업자가 로컬 실행 방법을 알 수 있다.
- 콘텐츠 수정 경로를 알 수 있다.
- 최소 회귀 검증 절차가 명확하다.

## 12. 전체 권장 진행 순서

현재 완료:

1. Phase 1: `App.tsx` 책임 분리

다음 권장 순서:

2. Phase 2: 커리큘럼 본문 lazy loading
3. Phase 5: 번들 최적화
4. Phase 3: 콘텐츠 원본 체계 정리
5. Phase 4: CSS 구조 분리
6. Phase 6: 미사용 코드 정리
7. Phase 7: 검증 체계 추가

이 순서를 추천하는 이유:

- Phase 2가 성능 개선 효과가 가장 크다.
- Phase 2를 안정적으로 하려면 Phase 1처럼 상세 화면 경계가 먼저 잡혀 있어야 한다.
- Phase 5는 Phase 2 결과를 보고 해야 중복 작업을 줄일 수 있다.
- Phase 3은 데이터 흐름을 확정하기 위한 문서/운영 정리 단계다.
- Phase 4는 기능 안정화 후 진행하는 것이 안전하다.
- Phase 6은 실제 사용 여부가 명확해진 뒤 제거해야 위험이 낮다.
- Phase 7은 중간에도 일부 도입 가능하지만, 구조가 어느 정도 잡힌 뒤 정리하는 것이 효율적이다.

## 13. 다음 작업 전 체크리스트

Phase 2 시작 전 권장 체크:

- [x] Phase 1 변경분을 git diff로 확인한다.
- [ ] 가능하면 Phase 1만 별도 커밋한다.
- [x] 브라우저에서 허브 화면이 정상 표시되는지 확인한다. 사용자 확인
- [x] 3D 노드 클릭으로 상세 진입이 되는지 확인한다. 사용자 확인
- [x] 뒤로가기가 정상 동작하는지 확인한다. 사용자 확인
- [x] `src/data/curriculum/lessons/*.md`와 `curriculumData.ts`의 `content_file` 매칭을 확인한다.
- [x] Phase 2 적용 전 빌드 결과를 다시 기록한다.

## 14. 현재 상태 요약

```text
Phase 0: 기준선 확인 - 부분 완료
Phase 1: App.tsx 책임 분리 - 완료
Phase 2: Markdown lazy loading - 완료
Phase 3: 콘텐츠 원본 체계 정리 - 대기
Phase 4: CSS 구조 분리 - 대기
Phase 5: 번들 최적화 - 대기
Phase 6: 미사용 코드 정리 - 대기
Phase 7: 검증 체계 추가 - 대기
```

## 15. 결정 필요 사항

Phase 2 전에 결정하면 좋은 사항:

1. markdown 본문 로딩 단위
   - 레슨 단위
   - 챕터 단위

2. `fullMarkdown` 제거 방식
   - 즉시 제거
   - optional fallback으로 유지 후 제거

3. 콘텐츠 원본
   - `src/data/curriculum/lessons/*.md`를 원본으로 볼지
   - `MD/`를 원본으로 보고 generator를 유지할지

4. 빌드 산출물 커밋 정책
   - `dist/` 유지 여부
   - `tsconfig.*.tsbuildinfo` 유지 여부
   - `.agents/logs/` ignore 여부

## 16. 권장 커밋 단위

권장 커밋 1:

```text
refactor: split app root into components and hooks
```

포함:

- `src/App.tsx`
- `src/components/*`
- `src/hooks/*`
- `src/types/graph.ts`

제외 권장:

- `.agents/logs/`
- 불필요한 build info 변경

권장 커밋 2:

```text
docs: add refactoring plan and phase 1 record
```

포함:

- `REFACTORING_PLAN.md`

권장 커밋 3:

```text
refactor: lazy load curriculum markdown content
```

포함:

- Phase 2 구현 파일
- loader
- 상세 화면 loading/error 처리

## 17. Self-Check

- Phase 1은 `npm run build`와 HTTP 200까지 확인했다.
- 브라우저에서 실제 3D 그래프 클릭과 상세 화면 스크롤을 시각적으로 검증한 기록은 아직 없다.
- Phase 2는 레슨 단위 lazy loading으로 구현 완료했다.
- Phase 2 후 내장 브라우저 자동화는 사용할 수 없어 클릭 기반 UI 검증은 직접 수행하지 못했다.
- `scripts/`의 생성 흐름은 아직 상세 분석 전이므로 Phase 3 계획은 현재 구조를 바탕으로 한 잠정안이다.
