# Portfolio — "The Being" · Project Plan

> **Direction update (2026-07-05):** after a reference video, the hero now
> features a holographic dev room (desk, animated code screen, keyboard, mug —
> emerald edge-render, built procedurally) plus wireframe floating objects
> across all sections. The being moved from the hero to Act V, materializing
> at the contact section. The Act III particle portrait is built from a real
> photo (`assets-src/`, sampled by `scripts/generate-portrait.ts`). One focal
> element per act: room → cards → portrait → timeline → being.

A 3D animated portfolio for Satish, built as a single continuous performance:
one entity made of ~20,000 emerald particles that assembles, works, reaches,
and greets — narrating the portfolio across five acts as the visitor scrolls.

**Design north star:** impressive but never overwhelming. One system with deep
behavior, not many competing effects. The wow comes from coherence.

---

## 1. Concept

### The core rule: conservation of particles

Everything rendered in 3D is made of the same particle pool. Particles are
never created or destroyed — only rearranged. The figure *is* the ambient
lattice; the project-card outlines *are* the figure, borrowed for a moment.
Visitors feel the coherence even if they never articulate the rule.

### The character

- The being is a skinned, rigged humanoid — **the developer himself**, via a
  Ready Player Me avatar (selfie → stylized rigged GLB, Mixamo-compatible).
- **Y Bot (Mixamo mannequin) is the working stand-in** until the avatar is
  made. The pipeline is model-agnostic: swapping characters = replacing one
  GLB file, zero code changes.
- Rendered as **particles / hologram — never a solid textured mesh**. Surface
  detail is irrelevant; silhouette, posture, and motion are everything.

### The five acts (scroll narrative)

| Act | Section | The being | The particles |
|-----|---------|-----------|---------------|
| I — Arrival | Hero | Assembles limb-by-limb during page load (the preloader IS the birth), notices the visitor, raises a hand | Loose drift → figure |
| II — The work | Selected work | Steps aside, pulls particles out of its own body and casts them into project-card outlines; looks at cards when hovered | Figure → card frames |
| III — The making | About / craft | Shapes something between its hands; **particle portrait moment** — the swarm condenses into a flat portrait of Satish's face sampled from a photo, holds a beat, exhales back | Orbiting halo → portrait → figure |
| IV — Reaching | Skills / growth | Reaches upward, particles stream through its arms into a rising column — skills as things still being pulled down, not owned badges | Figure → spiral column |
| V — Hello | Contact | Faces the visitor, arms open, halo settles; keystrokes in the contact form emit particles that drift into the being | Everything → calm halo |

### The personality layer (rare, observed, never performed)

- **Notices you** — lazy one-bone head lookAt tracking the cursor. Hold the
  cursor near it and it reaches a hand toward it. Slow reactions only.
- **Gets bored** — after ~30 s idle it sits/stretches/juggles particles;
  snaps back to attention on input.
- **Scroll is wind** — scroll velocity feeds a turbulence uniform; particles
  streak and the figure leans into fast scrolls.
- **404 page** — the being alone in the void, searching with a flashlight
  cone of particles.
- **Exactly one easter egg** — press `D` (or Konami code): a short dance
  clip, then it straightens up as if nothing happened. Never advertised.
- **Optional sound** — off by default; near-silent ambient drone + soft
  chimes on formation lock-in.

### The restraint contract

- The being never blocks or overlaps body text; content always wins contrast.
- Performs only during transitions; settles when scrolling stops.
- Every behavior has a rest state; no behavior repeats identically
  (additive-blend noise on top of every clip).
- Anti-uncanny rules: particles, never a solid face; slow lazy reactions;
  it ignores the visitor most of the time. Aloof is premium; eager is creepy.
- `prefers-reduced-motion` → beautiful still composition, not a broken page.

---

## 2. Visual direction

**Style: minimal luxury, dark, one strong color, glass as seasoning.**

### Palette

| Role | Hex |
|------|-----|
| Background (void) | `#050D0A` |
| Surface | `#0A1612` |
| Emerald primary | `#10B981` |
| Bright accent (particles) | `#34D399` |
| Text (mist) | `#E8F5F0` |
| Muted text | `#5C7A6E` |

Emerald in ~10% of pixels — scarcity is what makes it premium.

### Typography

- **Display:** high-contrast serif — Instrument Serif or Fraunces.
- **Body:** clean grotesque — General Sans or Inter.
- **Labels/meta:** mono — JetBrains Mono or Space Grotesk.

### Lighting & atmosphere

Dark-room photography: no ambient wash; particles are emissive (the scene's
own light source); exponential fog dissolving into the background color;
restrained bloom + vignette only. Frosted-glass nav/cards
(`backdrop-filter`, hairline borders) over the canvas — sparingly.

---

## 3. Site structure

Single-page scroll narrative (one persistent WebGL canvas = the world),
plus static per-project detail pages.

1. **Hero** — name, one-line identity, the being, scroll cue
2. **Selected work** — 3–5 projects max, alternating layout, shader-distortion
   hover on thumbnails; each links to a static detail page (light/no 3D)
3. **About / craft** — short bio + the portrait moment; skills as scene
   formations, never progress bars
4. **Experience** — compact vertical timeline
5. **Contact** — one email link, 3–4 icons, the calm ending

**Transitions:** canvas fixed behind everything; scroll scrubs the camera and
morphs particle formations between act states. DOM fades/slides with slight
stagger. Lenis smooth scroll. Project pages use a Framer Motion overlay wipe
(hides WebGL teardown).

---

## 4. Technical architecture

### Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router, **static export**) |
| Runtime / PM | Bun |
| 3D | Three.js via `@react-three/fiber` |
| 3D helpers | `@react-three/drei` (useGLTF, useAnimations, Text, shaderMaterial, PerformanceMonitor) |
| Postprocessing | `@react-three/postprocessing` — bloom + vignette ONLY |
| Scroll animation | `gsap` + ScrollTrigger (scrubbed camera/formations) |
| Smooth scroll | `lenis` |
| DOM animation | `framer-motion` |
| Shared state | `zustand` (current act, pointer, scroll velocity, quality tier) |
| Dev tuning | `leva` (dev-only, stripped from prod) |
| Asset tooling | Blender + `@gltf-transform/cli` (meshopt/Draco) |

### Project structure

```
src/
  app/                  # layout.tsx, page.tsx, work/[slug]/page.tsx
                        # (generateStaticParams), not-found.tsx
  components/
    dom/                # Nav, Section, ProjectCard, ContactForm — pure HTML/CSS
    canvas/             # Scene, Being, ParticleSystem, Formations, CameraRig,
                        # Effects — R3F only
  shaders/              # particle vertex/fragment shaders (skinning chunks,
                        # morph lerp, turbulence)
  hooks/                # useScrollProgress, useQualityTier, useReducedMotion,
                        # useIdleTimer
  store/                # zustand store
  content/              # projects.ts — data-driven entries
public/
  models/               # being.glb (Y Bot now, RPM avatar later)
  portrait/             # preprocessed portrait point data
```

`<Canvas>` mounts once in the root layout via `next/dynamic` with
`ssr: false`. Hard DOM/canvas split; the two communicate only through zustand.

### Character & animation pipeline

1. **Model:** Ready Player Me avatar (selfie → GLB). Stand-in: Mixamo Y Bot.
2. **Clips (Mixamo, retargeted):** breathing idle · look around · sitting /
   stretch (bored states) · wave · a dance (easter egg). 4–6 clips total.
3. **Merge** clips into one GLB in Blender; compress with `gltf-transform`
   (meshopt + Draco). Budget: ≤ 2.5 MB, lazy-loaded after first paint with
   fade-in.
4. **Runtime:** drei `useAnimations` mixer; `crossFadeTo()` on act changes;
   one **additive layer** (head drift, weight shifts) on top so loops never
   read as loops — the `webgl_animation_skinning_additive_blending` trick.
5. **Particle skin:** particles sampled on the skinned surface; skinning math
   in a custom points shader (Three.js skinning chunks) or baked
   vertex-animation textures. Ship the hologram/fresnel material first;
   particle skin is the upgrade (same asset, material swap only).
6. **Formations:** each act = a precomputed particle target buffer (pose
   samples, card outlines, spiral, halo, portrait). GPU lerps between
   buffers driven by scroll progress.
7. **Portrait:** one high-contrast, front-lit photo → offline script samples
   dark pixels → target buffer JSON in `public/portrait/`.

### Inputs needed from Satish (non-blocking)

- [ ] Selfie → Ready Player Me avatar export
- [ ] One high-contrast portrait photo (front-lit, plain background)
- [ ] Pick animation clips on Mixamo (~20 min browse)
- [ ] 3–5 projects: title, one-liner, thumbnail, links
- [ ] Deployment target: `satish.github.io` root repo (no basePath) vs.
      project repo (needs basePath) vs. custom domain

---

## 5. Performance & accessibility budget

- **Targets:** 60 fps desktop, 30 fps floor mobile; ≤ 300 KB gzipped JS for
  the 3D layer; model ≤ 2.5 MB lazy-loaded.
- `dpr` clamped to `[1, 2]`; drei `PerformanceMonitor` drops particle count /
  DPR / postprocessing on weak devices.
- **Quality tiers:** desktop full (~20k particles) · mobile ~⅓ particles, no
  postprocessing · reduced-motion: static composition, mixer paused.
- All content lives in real DOM (selectable, indexable, screen-reader
  friendly); the canvas is decorative and `aria-hidden`.
- Textures (if any) KTX2/WebP; no textured GLTF materials needed under the
  particle treatment.
- GPU skinning of one ~20–30k-tri character is trivial; the real budget items
  are download size and shader complexity.

---

## 6. Deployment (GitHub Pages)

- `next.config`: `output: 'export'`, `images.unoptimized: true`,
  `basePath`/`assetPrefix` if hosted under a project repo path.
- Empty `.nojekyll` in the publish output (so Pages serves `_next/`).
- GitHub Actions: `oven-sh/setup-bun` → `bun install` → `bun run build` →
  upload `out/` via `actions/deploy-pages`.
- No SSR, no API routes, no server actions — everything static. The contact
  form is a `mailto:` link or a third-party form endpoint (e.g. Formspree).

---

## 7. Build tiers (each one is a complete, shippable site)

### Tier 1 — the foundation
- Next.js static-export skeleton + Pages CI pipeline (deploy a hello-world
  first, so deployment risk dies on day one)
- Persistent canvas, emerald void, ambient lattice (GPU points + curl noise)
- The being (Y Bot, hologram/fresnel material), breathing idle + cursor
  head-tracking
- Acts I & V, scroll-scrubbed camera, Lenis, DOM sections with real content
- Quality tiers + reduced-motion fallback

### Tier 2 — the performance
- Particle-skin material on the being (conservation rule goes live)
- Formation morphs: Acts II, III, IV (cards, portrait, spiral)
- Preloader assembly (Act I birth), idle/bored behaviors
- Project detail pages + overlay-wipe transitions

### Tier 3 — the delight budget
- Keystroke particles in the contact form
- Scroll-velocity wind turbulence
- 404 searching scene
- Dance easter egg (`D` / Konami)
- Optional ambient sound toggle

---

## 8. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Uncanny valley | Particles not solid faces; slow reactions; mostly aloof |
| Mobile GPU cost | Quality tiers, DPR clamp, PerformanceMonitor degradation |
| Skinned-particle shader complexity | Hologram material ships first; particle skin is an isolated upgrade |
| Asset size on Pages | gltf-transform compression, lazy load, 2.5 MB cap |
| basePath surprises on Pages | Deploy hello-world in Tier 1 before any 3D work |
| Scope creep | Tier system — every tier is a complete site |
