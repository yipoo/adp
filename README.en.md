# ADP — Prompt for Agents Design

English · [简体中文](README.md)

An interactive design library for AI Agent products: considered components, complete application templates, design prompts, and copyable source.

**33 designs · 5 Agent templates · English & Chinese · Next.js / React, Vue 3, HTML**

## Run locally

```sh
npm run dev
```

Open http://127.0.0.1:4180 . Node.js 22+; no installation or AI credentials needed to browse. Set `PORT=4181` to change the port.

## Library

- **20 Components:** the original 12, plus tool calls, plan queue, approval gate, citations, subagent tasks, error recovery, checkpoints, and context usage.
- **8 Blocks:** agent workspace, analytics, content review, project planning, pricing, hero, Agent execution timeline, and trace waterfall.
- **5 Templates:** conversations, research, workflow console, human-in-the-loop approvals, and knowledge workspace.

Agent templates include navigation, projects, a header, primary content, context, and working local interactions. Desktop uses three columns; tablet collapses context; mobile uses a main column with navigation and context drawers. Open the full preview or select Desktop 1440 / Tablet 768 / Mobile 390.

Free includes demos, responsive previews, search, favorites, and Free-design prompts / source. Lifetime unlocks all online Pro exports, bulk prompt management, and the complete bundle. Previously published GitHub versions remain free. **ADP Lifetime costs USD 29.90 once**, for convenient access to the complete bilingual source bundle. Keep downloaded versions permanently; packaged updates are provided while the product is actively maintained. Deployed at https://adp.yipoo.com . See [billing documentation](billing/README.md). Stripe is currently in test mode: no real payments are collected.

## Agent Timeline

Select **Agent Timeline** under Components or Blocks. The 10 new Free designs include bilingual demos, prompts, and React / Vue / HTML source. Their detail pages include public interaction references; see [scope, sources, and validation](docs/agent-timeline-references.md).

These patterns display observable events and public task summaries. Advancement, approval, retry, compaction and restoration affect only local preview state. Connect application services for real execution and persistence.

## English & Chinese

Switch EN / 中文 for the interface, catalog, specifications, prompts, demo content, and source. The first visit follows browser language; later visits remember your selection. Prompt edits are saved separately for each language. Search works across both languages.

## Copy source

Open a design → **Source code** → select a framework → copy or download:

| Framework | File | Integration |
| --- | --- | --- |
| Next.js / React | `.jsx` | Import the default component into React 18+ or Next.js; includes `use client` |
| Vue 3 | `.vue` | Import the single-file component into an existing Vue project |
| HTML / CSS / JS | `index.html` | Open the self-contained file directly |

All 198 files live under `sources/<id>/<en|zh>/`. They contain markup, CSS, and working behavior. React uses JSX and lifecycle-managed DOM interactions; Vue uses a native template and script setup. No iframe wrappers or runtime eval in the framework exports. Listeners and timers are cleaned up when unmounted.

The source has no external font, image, CDN, or UI-library dependencies. Styles are namespaced per design and can coexist with Tailwind CSS and shadcn/ui. These are not Tailwind-specific exports or a shadcn registry. Check integration against your project's existing resets and design system.

Templates emit a bubbling `adp-navigate` event with `event.detail.kind`: `chat`, `research`, `workflow`, `inbox`, or `knowledge`. Connect this event to your application's router. The standalone ADP preview already navigates between the five pages.

## Bring your own prompts

Edit the catalog in `data/catalog.json`, or use the browser's prompt editor and JSON import / export:

```json
[
  { "id": "agent-chat", "lang": "en", "prompt": "Your full prompt…" },
  { "id": "agent-chat", "lang": "zh", "prompt": "你们的完整 prompt…" }
]
```

Omitting `lang` uses the current UI language. Imports validate all entries before saving: 2MB per file, 50000 characters per prompt, known ids and languages, no duplicates or empty prompts. Invalid imports keep existing content. Imported values are text, never executable HTML or scripts.

Edits, saved designs, language, and theme persist in the current browser. Update the catalog for shared or published content. Previous Chinese prompt edits and saved designs remain compatible.

## Integration boundaries

AI responses, research content, workflow runs, and approval decisions are local UI interactions. No model calls, tool execution, publishing, project writes, or email sending occur. Files show metadata only; they are not uploaded, parsed, or indexed. Knowledge content previews are built in. “Share brief” downloads a local text file. The waveform has no recording or audio output.

Templates still need your own application services. The ADP website itself connects Supabase Auth, isolated billing data, private bundle storage, and Stripe sandbox Lifetime checkout.

## Develop and validate

```sh
npm ci
npm run check
npm run generate:sources
npm run prepare:runtime
```

Checks cover bilingual content, tiers, prompt completeness, React JSX compilation, Vue script / template / style compilation, HTML script syntax, and consistency between exported source and demos.

`qa-runtime/` contains generated local React / Vue runtime fixtures and is not committed. Initialization scripts `tools/update-catalog.mjs` and `tools/seed.py` overwrite seed content; do not rerun after editorial changes.

## Reference

Inspired by the presentation and live-preview approach of [Detent](https://detentui.com/). All source and prompts are original; no paid source, brand assets, or screenshots are copied. Framework guidance: [Next.js client components](https://nextjs.org/docs/app/api-reference/directives/use-client) and [Vue lifecycle hooks](https://vuejs.org/api/composition-api-lifecycle.html).
