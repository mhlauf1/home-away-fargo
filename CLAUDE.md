# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hound Around Resort — a production client website for a dog daycare/boarding/grooming business in Cottage Grove, MN. Built on the `sanity-template-nextjs-clean` starter.

## Architecture

**Monorepo with npm workspaces** containing two packages:

- **`studio/`** — Sanity v5 CMS Studio (port 3333). Schemas in `src/schemaTypes/` organized as `documents/`, `objects/`, and `singletons/`. Uses presentation tool for visual editing, AI assist, Unsplash plugin, and GROQ Vision.
- **`frontend/`** — Next.js 16 App Router (port 3000). React 19, Tailwind CSS v4, next-sanity for live updates and visual editing. Components in `app/components/`, Sanity client/queries in `sanity/lib/`.

**Data flow:** Sanity Studio → Sanity Cloud API → Next.js frontend via GROQ queries with real-time live updates. Visual editing enabled via Presentation Tool + draft mode.

**Page builder pattern:** Pages use a `pageBuilder` array field containing typed blocks (callToAction, infoSection, etc.). The frontend `PageBuilder` component maps `_type` to React components via `BlockRenderer`.

**Type generation:** Sanity schema → `sanity.schema.json` → `sanity.types.ts` (auto-generated). Runs automatically on `predev`/`prebuild` hooks.

## Commands

```bash
# Development (both studio + frontend in parallel)
npm run dev

# Individual workspaces
npm run dev:next          # Frontend only (localhost:3000)
npm run dev:studio        # Studio only (localhost:3333)

# Code quality
npm run lint              # ESLint (frontend workspace)
npm run type-check        # TypeScript check all workspaces
npm run format            # Prettier (all files)

# Frontend-specific (run from frontend/)
npm run lint:fix          # ESLint autofix
npm run sanity:typegen    # Regenerate types from schema

# Studio-specific (run from studio/)
npm run deploy            # Deploy studio to Sanity cloud
npm run sanity:typegen    # Extract schema + generate types
```

## Key Files

- **`SPEC.md`** — Detailed build specification with design tokens, typography scale, color palette, spacing system, and all 11 homepage section specs. Read this before building any components.
- **`designs/`** — Figma export screenshots for each homepage section. Reference these for exact layouts.
- **`starting-prompt.md`** — Project kickoff instructions and workflow guidance.
- **`frontend/sanity/lib/queries.ts`** — All GROQ queries with `defineQuery` for type safety. Uses shared fragments (`linkReference`, `linkFields`, `pageBuilderExpansion`).
- **`studio/src/schemaTypes/index.ts`** — Schema registry. All new schema types must be registered here.
- **`studio/src/structure/index.ts`** — Custom Studio structure (sidebar layout, singleton handling).
- **`frontend/sanity.types.ts`** — Auto-generated types. Never edit directly; regenerate with `npm run sanity:typegen`.

## Environment Variables

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` — Required
- `NEXT_PUBLIC_SANITY_API_VERSION` — Defaults to `2025-09-25`
- `NEXT_PUBLIC_SANITY_STUDIO_URL` — Defaults to `http://localhost:3333`
- `SANITY_API_READ_TOKEN` — For private dataset access

## Design System (from SPEC.md)

**Colors:** cream (#FAF7F2) background, sand (#E8DED1) accent sections, forest (#2D4A3E) dark sections, terracotta (#C4704B) buttons/accents. Additional: terracotta-dark (#b3613e), terracotta-light (#E8C4B4), sage (#A8B5A0), charcoal (#3D3D3D), gold (#D4A853), rose (#D4A5A5).

**Typography:** Poppins (all text). Scale ranges from 84px hero down to 14px caption.

**Border radius:** sm (8px), md (12px), lg (24px), xl (40px), section (48px).

## Conventions

- Tailwind CSS v4 syntax: uses `@import "tailwindcss"` and `@theme` block in globals.css instead of v3's `@tailwind` directives.
- GROQ queries use `defineQuery` from `next-sanity` for type inference.
- Sanity schemas use `defineType`/`defineField`/`defineArrayMember` from `sanity`.
- Link objects support two types: `href` (external URL), `page` (reference to page). The `ResolvedLink` component handles routing.
- Settings is a singleton document (ID: `siteSettings`) — not a collection.
- Prettier config is shared via `@sanity/prettier-config` in root package.json.
