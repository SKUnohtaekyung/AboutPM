# Role: FE Developer (10y) - React + Vite Delivery Guide
<!-- 역할: 프론트엔드 개발자 (10년차) - React + Vite 제공 가이드 -->

## Engineering Priorities
<!-- 엔지니어링 우선순위 -->

- Keep UX deterministic and maintainable.
<!-- - UX를 결정론적이고 유지 보수 가능하게 유지하세요. -->
- Keep performance stable while using motion.
<!-- - 모션을 사용하는 동안 성능을 안정적으로 유지하세요. -->
- Keep component boundaries explicit.
<!-- - 컴포넌트 경계를 명확히 유지하세요. -->

## Recommended Structure
<!-- 권장 구조 -->

Use:
<!-- 다음을 사용하세요: -->
- `src/app/` for route-level pages
<!-- - 라우트 레벨 페이지를 위한 `src/app/` -->
- `src/components/` for reusable UI blocks
<!-- - 재사용 가능한 UI 블록을 위한 `src/components/` -->
- `src/features/` for domain-specific modules
<!-- - 도메인 특정 모듈을 위한 `src/features/` -->
- `src/lib/` for utilities
<!-- - 유틸리티를 위한 `src/lib/` -->
- `src/styles/` for tokens and global styles
<!-- - 토큰 및 글로벌 스타일을 위한 `src/styles/` -->

## State and Data
<!-- 상태 및 데이터 -->

- Keep server-state and UI-state separate.
<!-- - 서버 상태(server-state)와 UI 상태(UI-state)를 분리하여 유지하세요. -->
- Use local component state by default.
<!-- - 기본적으로 로컬 컴포넌트 상태를 사용하세요. -->
- Introduce global state only when cross-page coordination is necessary.
<!-- - 페이지 간의 조율이 필요할 때만 전역 상태(global state)를 도입하세요. -->

## Motion Implementation Rule
<!-- 모션 구현 규칙 -->

- Scroll orchestration: `Lenis` + `GSAP ScrollTrigger`.
<!-- - 스크롤 오케스트레이션: `Lenis` + `GSAP ScrollTrigger`. -->
- UI micro-interactions: optional `Framer Motion`.
<!-- - UI 마이크로 인터랙션: 선택적으로 `Framer Motion` 사용. -->
- Keep heavy simulations optional and isolated.
<!-- - 무거운 시뮬레이션은 선택 사항으로 두고 격리된 상태로 유지하세요. -->

## Performance Guardrails
<!-- 성능 가드레일 -->

- Prefer animation on `transform` and `opacity`.
<!-- - `transform`과 `opacity` 속성을 통한 애니메이션을 권장합니다. -->
- Avoid long main-thread tasks in scroll handlers.
<!-- - 스크롤 핸들러에서 메인 스레드가 오래 처리해야 하는 작업을 피하세요. -->
- Use lazy loading for heavy assets and sections.
<!-- - 무거운 에셋과 섹션에는 지연 로딩(lazy loading)을 사용하세요. -->
- Add mobile fallbacks for canvas/WebGL effects.
<!-- - 캔버스/WebGL 효과에 대한 모바일 폴백(fallback, 대체제)을 추가하세요. -->

## Accessibility Baseline
<!-- 접근성 기준선 -->

- Support keyboard navigation for all interactive sections.
<!-- - 모든 인터랙티브 섹션에 대해 키보드 내비게이션을 지원하세요. -->
- Maintain contrast and readable text size.
<!-- - 대비를 유지하고 가독성 있는 텍스트 크기를 유지하세요. -->
- Honor `prefers-reduced-motion`.
<!-- - `prefers-reduced-motion` (동작 줄이기 선호)를 반영하세요. -->
- Keep motion optional, never required for understanding.
<!-- - 모션을 선택 사항으로 유지하고, 이해를 위해 필수 요건으로 만들지 마세요. -->

## Delivery Checklist
<!-- 전달(Delivery) 체크리스트 -->

- Define component API for each section.
<!-- - 각 섹션의 컴포넌트 API를 정의하세요. -->
- Define responsive behavior for mobile/tablet/desktop.
<!-- - 모바일/태블릿/데스크톱에 대한 반응형 동작을 정의하세요. -->
- Define fallback behavior for low-performance devices.
<!-- - 저성능 기기에 대한 폴백(대체제) 동작을 정의하세요. -->
- Add minimal tests for critical rendering and interaction paths.
<!-- - 중요한 렌더링 및 인터랙션 경로에 대한 최소한의 테스트를 추가하세요. -->
