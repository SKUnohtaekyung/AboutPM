# Role: Designer (10y) - Motion Reference Playbook

## 1) Design Direction From References

- Visual tone: soft futuristic, premium, calm.
- Core style: glassmorphism cards, lavender-indigo gradients, clean grid, large whitespace, rounded geometry.
- Texture: subtle glow + low-opacity noise, avoid harsh contrast.
- Composition rule: keep one dominant focal object per section (orb, abstract 3D symbol, product visual).
- Typography rule: bold headline + compact supporting copy, high readability first.

## 2) Motion System Principles

- Use motion to explain hierarchy, state change, and user focus. Never animate only for decoration.
- Apply one primary animation per viewport, max two secondary effects.
- Keep section transitions smooth and continuous across scroll.
- Use consistent easing and timing across all sections.

Recommended baseline:
- Duration: 0.4s to 1.2s for UI motion, 1.2s to 2.5s for hero reveals.
- Easing: `power2.out`, `power3.out`, `expo.out` only.
- Performance target: 60fps on desktop, graceful downgrade on mobile.

## 3) Global Effects (Always-On Layer)

Use from `animation.md`:
- `Lenis Smooth Scroll`: default enabled for whole site.
- `Cinematic Preloader`: only for first visit/session, skip on repeat visit.
- `Custom Magnetic Cursor`: desktop only, interactive elements only.
- `Grain Noise Overlay`: very low opacity (2% to 6%).
- `Floating Dock Nav`: optional for long-scroll storytelling pages.

## 4) Section-by-Section Motion Mapping

### A. Hero (first impression)

Primary:
- `Split Text Stagger`

Secondary:
- `Mask Reveal (Clip-Path Animation)`
- `Interactive Water Ripple` (background)

Use case:
- Landing intro, product value proposition, PM learning portal opening scene.

### B. Narrative / Concept explanation

Primary:
- `Text Reveal (Background Clip)`

Secondary:
- `SVG Path Drawing (Stroke Dashoffset)`
- `Theme Transition (Background Color Swap)` between major chapters

Use case:
- PM framework explanation, process flow (Discovery -> Delivery), KPI story blocks.

### C. Feature / Curriculum cards

Primary:
- `Accordion Gallery`

Secondary:
- `Holo-Card (3D Tilt Effect)`
- `Hover Image Reveal`

Use case:
- Learning module list, curriculum highlights, feature clusters.

### D. Case study / Showcase

Primary:
- `Pin & Scale (Immersive Zoom)`

Secondary:
- `Velocity Skew (Physics Distortion)`
- `Explode Gallery (Scatter Effect)` only at section entrance

Use case:
- Case detail transitions, before/after outcomes, portfolio storytelling.

### E. Advanced / Experimental zone (limited use)

Primary candidates:
- `Particle Text Disperse`
- `Constellation Network`
- `Generative Flow Field`
- `Gravity Physics (Physics Engine)`
- `RGB Kinetic Typography`

Rule:
- Use in isolated playground/demo blocks only. Do not use in core learning flow.

## 5) Usage Rules By Context

- Core content readability priority: use subtle motion only.
- CTA sections: use short, directional motion to guide click intent.
- Data-heavy sections: disable decorative effects, keep transitions functional.
- Mobile: disable heavy canvas/WebGL effects by default.

## 6) Do / Don't

Do:
- Combine effects with explicit intent (focus, continuity, feedback).
- Keep animation names in English keywords when handing off to AI/FE dev.
- Test motion with real content length, not placeholder text only.

Don't:
- Stack multiple high-energy effects in same viewport.
- Use `RGB Kinetic Typography` in long reading areas.
- Trigger scroll-linked effects without fallback for low-performance devices.

## 7) Accessibility and Performance Guardrails

- Respect `prefers-reduced-motion: reduce`:
  - disable parallax, skew, ripple, particle systems
  - keep only opacity fade and instant state changes
- Keep animations on `transform` and `opacity` when possible.
- Avoid layout thrashing (`top/left/width/height` animated repeatedly).
- Lazy-init heavy effects only when section enters viewport.

## 8) Suggested Tech Stack for FE Handoff

- Scroll + timeline: `GSAP ScrollTrigger` + `Lenis`.
- UI-level micro-interactions: `Framer Motion` (optional).
- Heavy visual simulations (particle/water/flow): `Canvas` or `WebGL` with mobile fallback.

## 9) Default Motion Recipe for This Project

Use this as default composition:
- Hero: `Split Text Stagger` + `Mask Reveal` + subtle `Interactive Water Ripple`
- Module list: `Accordion Gallery` + `Hover Image Reveal`
- Concept sections: `Text Reveal` + `SVG Path Drawing`
- Case section: `Pin & Scale`
- Global: `Lenis Smooth Scroll` + low `Grain Noise Overlay`

This recipe keeps the same mood as the provided references while maintaining readability for a PM-learning product.
