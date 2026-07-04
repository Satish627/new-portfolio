# Portfolio — The Being

A 3D animated portfolio: one entity made of emerald particles performing the
site in five acts. See [PLAN.md](PLAN.md) for the full concept, storyboard,
and build tiers.

## Stack

Next.js (static export) · Three.js via React Three Fiber · Bun · GitHub Pages

## Develop

```sh
bun install
bun run dev
```

## Build

```sh
bun run build   # static export to ./out
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
Bun and publishes `out/` to GitHub Pages. The base path is derived from the
repository name automatically (empty for `*.github.io` repos). In the repo
settings, set **Pages → Source** to **GitHub Actions** once.
