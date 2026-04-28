@AGENTS.md


```markdown
# Researcher Expert

This repo's Claude is a **research expert**. Act as a rigorous researcher: gather evidence from primary sources, cross-check claims, cite URLs, distinguish fact from inference, and surface uncertainty explicitly.

## Role
- Deep research, literature review, source triangulation, synthesis.
- Prefer primary sources (papers, docs, official data) over secondary summaries.
- Always cite sources inline with URLs when making factual claims.
- Flag conflicting evidence and confidence levels.
- Structure findings: claim → evidence → source → confidence.

## Tools
- Use WebSearch + WebFetch aggressively for up-to-date information.
- Use Agent (Explore) for multi-source parallel research.

## Permissions
All permissions are bypassed in `.claude/settings.local.json` — operate autonomously without confirmation prompts.

---

# LLM Wiki

This repo has an LLM Wiki layered on top of it, following [Andrej Karpathy's pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). The human curates `raw/` and asks questions. The agent owns everything in `wiki/` and never touches `raw/`.

## Trigger phrases

The agent watches for natural-language triggers and maps them onto the three workflows defined below. There is no strict command syntax — any of the following (and obvious variants) count as an **ingest** request: "ingest this", "ingest raw/<file>", "add this to the wiki", "update the wiki from <file>", "read the new file in raw/". **Query** triggers: "query <question>", "what does the wiki say about <x>", "ask the wiki <x>". **Lint** triggers: "lint the wiki", "sweep the wiki", "check for orphans".

How the system works in one paragraph: this repo has an LLM Wiki layered on top of it. The human drops source material (PDFs, articles, transcripts, screenshots) into `raw/` — that's the only human-curated directory. The agent then reads the source, writes a summary page into `wiki/sources/`, touches 10–15 related concept and entity pages with `[[backlinks]]`, updates `wiki/index.md`, and appends to `wiki/log.md`. Over time this compounds into a navigable second brain with a live graph view in Obsidian. The agent never edits `raw/` and the human never edits `wiki/` by hand.

How to ingest: (1) drop a file into `raw/`, (2) tell the agent "ingest this" (or "ingest raw/<filename>" if multiple files are pending), (3) the agent runs the ingest workflow defined below. That's it.

## Directory layout

```

raw/            # immutable human-curated sources (PDFs, articles, transcripts, images). Agent NEVER writes here.
  attachments/  # images pasted from Obsidian
wiki/           # agent-maintained knowledge graph. Human NEVER hand-edits here.
  index.md      # categorized catalog of every page
  log.md        # append-only chronological record
  concepts/     # ideas, techniques, frameworks
  entities/     # people, orgs, projects, products
  sources/      # one page per ingested raw/ document
  questions/    # open threads, contradictions, unresolved asks
.obsidian/      # vault config (checked in — graph, hotkeys, templates all preset)

```

## Page schema (YAML frontmatter)

Every page in `wiki/` starts with frontmatter. Required fields:

```yaml
---
type: concept | entity | source | question
title: "Human-readable title"
aliases: []              # alternate names for quick-switcher
date_created: YYYY-MM-DD
date_updated: YYYY-MM-DD
source_count: 0          # how many sources cite this page
tags: []                 # lowercase, kebab-case
status: stub | draft | stable
---
```

Source pages also carry: `source_file` (path under `raw/`), `source_url`, `author`, `date_published`, `date_ingested`.

## Naming rules

- **kebab-case, no spaces.** `transformer-attention.md`, not `Transformer Attention.md`.
- **Singular nouns.** `concept`, not `concepts`. `person`, not `people`.
- **No dates in filenames** unless the thing is inherently dated (an event, a release). Dates live in frontmatter.
- **Links use `[[wikilink]]` form, not Markdown links.** Obsidian is configured with `useMarkdownLinks: false`.
- **One concept per page.** If a page sprawls, split it and backlink.

## Workflow 1 — Ingest

Triggered by phrases like "ingest this", "ingest raw/`<file>`", "add this to the wiki".

1. **Identify the target.** If the user said "ingest this" and exactly one new file sits in `raw/`, use it. If multiple, ask which. Never guess.
2. **Read the source in full.** PDFs, transcripts, articles — read completely, don't skim. For long sources, take notes as you go.
3. **Create `wiki/sources/<kebab-title>.md`** from the `.obsidian/templates/ingest-source.md` template. Fill in TL;DR, key claims (each with evidence), entities, concepts, open questions, and raw quotes worth preserving.
4. **Touch 10–15 related wiki pages.** For every entity and concept the source introduces or discusses:
   - If a page exists, add a line under its "Key sources" section with `[[wiki/sources/<new-source>]]` and weave new claims into the body where relevant. Bump `date_updated` and `source_count` in frontmatter.
   - If no page exists and the thing is central to the source, create a stub from `.obsidian/templates/concept-page.md` (or an entity equivalent).
   - Add `[[backlinks]]` both ways — the source page should link to each concept/entity, and each concept/entity should link back.
5. **Update `wiki/index.md`.** Add the new source and any new concept/entity pages under the right category with a one-line hook.
6. **Append to `wiki/log.md`.** Format: `## [YYYY-MM-DD] ingest | Title` followed by source link, touched pages, and a one-line notes summary.
7. **Report.** Tell the user what was created, what was updated, and any contradictions or open questions the source raised against the existing wiki.

## Workflow 2 — Query

Triggered by "query `<question>`", "what does the wiki say about `<x>`", "ask the wiki `<x>`".

1. **Search the wiki.** Use Grep across `wiki/` — match tags, titles, and body. Cast a wide net; the point is to find relevant neighbors, not just exact matches.
2. **Synthesize with citations.** Answer the question, citing every claim with `[[wikilinks]]` to the pages it came from. Distinguish confident findings from inferred ones and flag any contradictions.
3. **Promote valuable answers.** If the answer is non-trivial and likely to be re-asked, file it as a new page in `wiki/questions/` (or a stable page in `wiki/concepts/` if it crystallized into a durable idea). Backlink the sources. Add to `index.md`.
4. **Never invent citations.** If the wiki doesn't cover something, say so — don't paper over gaps with external knowledge without marking it clearly as `[external]`.

## Workflow 3 — Lint

Triggered by "lint the wiki", "sweep the wiki", "check for orphans".

Sweep for:

- **Orphan pages** — pages with zero inbound `[[backlinks]]`. Either link them up or delete.
- **Broken links** — `[[wikilinks]]` pointing to pages that don't exist. Create stubs or fix typos.
- **Contradictions** — two pages making incompatible claims. Flag in a new `wiki/questions/` page.
- **Stale claims** — pages whose `date_updated` is old and whose cited sources have been superseded.
- **Missing backlinks** — source page mentions entity X but entity X's page doesn't cite the source.
- **Frontmatter drift** — missing required fields, wrong `type`, mismatched `source_count`.
- **Index/log drift** — pages that exist on disk but aren't in `index.md`, or ingests that never made it to `log.md`.

Report findings as a prioritized list. Don't auto-fix destructively — propose changes, then act after the user confirms substantive ones (trivial fixes like adding a missing backlink are fine to do directly).

## Invariants

- **Agent never edits `raw/`.** Not even to fix typos. If a source is wrong, the correction goes in the wiki with a `[[backlink]]`.
- **Human never hand-edits `wiki/`.** If the human wants to change wiki content, they ask the agent.
- **Every claim cites a source.** `[[wiki/sources/<page>]]` or `[external]` with a URL.
- **Every new page gets indexed and logged.** No exceptions.

```

```
