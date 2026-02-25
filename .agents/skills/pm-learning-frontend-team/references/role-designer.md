# Role: Designer (10y) - Motion Reference Playbook
<!-- 역할: 디자이너 (10년차) - 모션 레퍼런스 플레이북 -->

## Visual Direction
<!-- 시각적 방향성 -->

- Use a soft-futuristic tone with premium but calm composition.
<!-- - 프리미엄하면서도 차분한 구성을 가진 부드러운 미래지향적 톤을 사용하세요. -->
- Emphasize the Deep Purple Color System. Use rich purples (#4f35ce, #3b2c85), soft lilacs, and high-contrast clean spacing.
<!-- - 딥 퍼플 컬러 시스템을 강조하세요. 풍부한 보라색, 부드러운 라일락, 그리고 대비가 선명한 깔끔한 여백을 사용하세요. -->
- Use glassmorphism cards and deep lavender-indigo gradients. 
<!-- - 글래스모피즘 카드와 깊은 라벤더-인디고 그라데이션을 사용하세요. -->
- Keep one focal visual per section.
<!-- - 섹션당 하나의 중심 시각 요소를 유지하세요. -->
- Keep headline contrast and readability above style effects. Typography must feel like a premium published book.
<!-- - 헤드라인의 대비와 가독성을 스타일 효과보다 우선시하세요. 영문/국문 타이포그래피는 프리미엄 단행본 서적처럼 구성되어야 합니다. -->

## Motion Principles
<!-- 모션 원칙 -->

- Animate with intent only: hierarchy, guidance, feedback.
<!-- - 의도를 가진 애니메이션만 적용하세요: 계층 구조, 안내, 피드백. -->
- Use one primary effect per viewport, plus up to two secondary effects.
<!-- - 뷰포트당 하나의 주요 효과를 사용하고, 최대 두 개의 보조 효과를 추가하세요. -->
- Keep transitions smooth and cohesive across scroll.
<!-- - 스크롤 전반에 걸쳐 전환을 부드럽고 일관성 있게 유지하세요. -->
- Keep easing and timing consistent.
<!-- - 이징(easing)과 타이밍을 일관되게 유지하세요. -->

Baseline:
<!-- 기준점: -->
- UI motion: 0.4s to 1.2s
<!-- - UI 모션: 0.4초에서 1.2초 -->
- Hero reveals: 1.2s to 2.5s
<!-- - 히어로 리빌: 1.2초에서 2.5초 -->
- Easing: `power2.out`, `power3.out`, `expo.out`
<!-- - 이징: `power2.out`, `power3.out`, `expo.out` -->

## Global Effects
<!-- 전역 효과 -->

- `Lenis Smooth Scroll`: on by default.
<!-- - `레니스 부드러운 스크롤 (Lenis Smooth Scroll)`: 기본으로 켜짐. -->
- `Cinematic Preloader`: first session only.
<!-- - `시네마틱 프리로더 (Cinematic Preloader)`: 첫 세션에만 적용. -->
- `Custom Magnetic Cursor`: desktop only.
<!-- - `커스텀 마그네틱 커서 (Custom Magnetic Cursor)`: 데스크톱에만 적용. -->
- `Floating Dock Nav`: optional on long narrative pages.
- `Floating Dock Nav`: optional on long narrative pages.
<!-- - `플로팅 독 내비게이션 (Floating Dock Nav)`: 긴 내러티브 페이지에서 선택적 적용. -->

## Section Mapping
<!-- 섹션 매핑 -->

### Hero
<!-- 히어로 -->

- Primary: `Split Text Stagger`
<!-- - 주요 효과: `텍스트 분할 시차 (Split Text Stagger)` -->
- Secondary: `Mask Reveal (Clip-Path Animation)`, `Interactive Water Ripple`
<!-- - 보조 효과: `마스크 리빌 (Mask Reveal)`, `인터랙티브 물결 (Interactive Water Ripple)` -->

### Concept Narrative
<!-- 콘셉트 내러티브 -->

- Primary: `Text Reveal (Background Clip)`
<!-- - 주요 효과: `텍스트 리빌 (Text Reveal)` -->
- Secondary: `SVG Path Drawing (Stroke Dashoffset)`, `Theme Transition (Background Color Swap)`
<!-- - 보조 효과: `SVG 패스 드로잉 (SVG Path Drawing)`, `테마 전환 (Theme Transition)` -->

### Curriculum and Feature Blocks
<!-- 커리큘럼 및 기능 블록 -->

- Primary: `Accordion Gallery`
<!-- - 주요 효과: `아코디언 갤러리 (Accordion Gallery)` -->
- Secondary: `Holo-Card (3D Tilt Effect)`, `Hover Image Reveal`
<!-- - 보조 효과: `홀로 카드 (Holo-Card)`, `호버 이미지 리빌 (Hover Image Reveal)` -->

### Case Study
<!-- 사례 연구 (케이스 스터디) -->

- Primary: `Pin & Scale (Immersive Zoom)`
<!-- - 주요 효과: `핀 및 스케일 (Pin & Scale)` -->
- Secondary: `Velocity Skew (Physics Distortion)`, `Explode Gallery (Scatter Effect)`
<!-- - 보조 효과: `속도 스큐 (Velocity Skew)`, `익스플로드 갤러리 (Explode Gallery)` -->

### Experimental Playground
<!-- 실험적 플레이그라운드 -->

- `Particle Text Disperse`
<!-- - `파티클 텍스트 분산 (Particle Text Disperse)` -->
- `Constellation Network`
<!-- - `별자리 네트워크 (Constellation Network)` -->
- `Generative Flow Field`
<!-- - `제너레이티브 플로우 필드 (Generative Flow Field)` -->
- `Gravity Physics (Physics Engine)`
<!-- - `중력 물리 엔진 (Gravity Physics)` -->
- `RGB Kinetic Typography`
<!-- - `RGB 키네틱 타이포그래피 (RGB Kinetic Typography)` -->

Use experimental effects only in isolated demo areas.
<!-- 실험적인 효과는 분리된 데모 영역에서만 사용하세요. -->

## Accessibility and Performance
<!-- 접근성 및 성능 -->

- Respect `prefers-reduced-motion: reduce`.
<!-- - `prefers-reduced-motion: reduce` (동작 줄이기 선호)를 존중하세요. -->
- Disable heavy visual physics on mobile by default.
<!-- - 모바일에서는 무거운 시각적 물리 효과를 기본적으로 비활성화하세요. -->
- Prefer `transform` and `opacity` animation.
<!-- - `transform`과 `opacity` 속성을 이용한 애니메이션을 권장합니다. -->
- Lazy-init heavy effects when entering viewport.
<!-- - 뷰포트에 진입할 때 무거운 효과를 지연 초기화(Lazy-init)하세요. -->

## Color system
<!-- 색상 시스템 -->   
main color : point color : accent color = 6 : 3 : 1
Background Color: #FBF8FF (눈이 피로하지 않은 포근한 라이트 라일락 배경, 텍스트 가독성 최적화)
Main Color: #A259FF (활력 있고 트렌디한 퍼플, 헤드라인, 3D 그래프 액티브 노드 등)
Point Color: #35244A (깊고 무거운 다크 바이올렛. 본문 텍스트 및 UI 요소의 경계선 등에 사용하여 구조감/무게감 형성)
Accent Color: #FFC400 (에너제틱한 옐로우. 각 챕터의 '유치원생 비유 블록' 및 '핵심 실무 사례' 등 시선이 반드시 꽂혀야 하는 곳에만 강렬하게 사용)
Black color : #06010bff (헤드라인, 본문 텍스트 및 UI 요소의 경계선 등에 사용하여 구조감/무게감 형성)

## Typography
<!-- 타이포그래피 (Pretendard Font System) -->
지정해주신 폰트 시스템을 준수하여 Book-level(단행본 수준) 독서 경험을 설계합니다.

Title (H1): Pretendard 800 (ExtraBold), letter-spacing -0.025em, line-height 1.1
Heading (H2/H3): Pretendard 700 (Bold), letter-spacing -0.015em, line-height 1.3
Body Text: Pretendard 400/500 (Regular/Medium). 특히 모바일/웹 모두에서 책을 읽는 듯한 line-height 1.7 (독서용 최적 여백) 적용, word-break: keep-all 완벽 조율.
