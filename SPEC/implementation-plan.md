# Implementation Plan

This plan is derived from `/KERNEL/` and assumes `/KERNEL/` remains immutable.

## 1. Kernel Alignment

The current kernel is internally aligned around a loaded `Link` shape with `id`, `url`, `title`, `tags`, `published`, and `description`.

Implementation work should treat `createdAt` as non-invariant ingest/runtime metadata unless the kernel is changed to include it. It must not affect ids, selected links, source membership, source counts, or published/description behavior.

## 2. Red/Green Test Plan

Use concise table-driven tests where practical.

| Area | Red test first | Green implementation |
| --- | --- | --- |
| Link shape | loaded links expose `id`, `url`, `title`, `tags`, `published`, `description` | centralize construction/validation in `models/link` |
| Link required fields | rejects records missing non-empty `url`, `title`, or tags | normalize or skip invalid source records |
| Link ids | duplicate ids are detected or prevented | enforce unique ids in collection loading |
| Published | unknown and invalid values normalize to null | validate/normalize in the Link model |
| Published | known values preserve ISO 8601 strings | validate ISO date strings before storing |
| Description | missing or blank description derives from title | generate during Link initialization |
| Description | published year suffix is appended once | keep suffix appending idempotent |
| Tag normalization | case, whitespace, punctuation, and idempotence examples | centralize normalization in `models/tag` |
| Favorite tags | favorite tags may render without backing links | represent favorites separately from loaded link tags |
| Slug uniqueness | two labels normalizing to the same slug are not both accepted silently | canonical tag collection rejects or warns |
| URL parsing | `/`, `/tags`, and `/sources` route namespaces are parsed distinctly | parse namespace before selected slugs |
| URL parsing | mixed case and duplicate selected segments canonicalize to unique lowercase slugs | parse path into a slug set |
| Filtering | no selected tags includes all links | filtering uses selected slug set |
| Filtering | selected tags include links with at least one matching tag | compare selected slugs with normalized link tag labels |
| Sources | invalid URLs produce no source | guard URL parsing |
| Sources | source domain strips leading `www.` | canonicalize domain in a model/helper layer |
| Sources | membership is exact over currently included links | aggregate after filtering |
| Sources | zero-count sources are excluded | filter source groups by member count |
| Sources | links sort by published date ascending, null last | sort expanded source members by normalized published value |

## 3. Architecture Plan

Keep business rules in model/helper layers, not presentation components.

```mermaid
flowchart TD
  A["JSON content sources"] --> B["Link model validation"]
  B --> C["published normalization"]
  B --> D["description derivation"]
  B --> E["Tag model normalization"]
  E --> F["Links collection"]
  F --> G["URL namespace parser"]
  G --> H["Selected slug set"]
  H --> I["Included links selector"]
  F --> I
  I --> J["Sources aggregation"]
  I --> K["Links view components"]
  J --> L["Sources view components"]
```

## 4. User Journey

```mermaid
flowchart TD
  A["User opens /"] --> B["Links View with no selected tags"]
  B --> C["App loads and normalizes links"]
  C --> D["All links are included"]
  D --> E["User clicks a tag"]
  E --> F["URL updates to /tags/{slug}"]
  F --> G["Included links are recalculated"]
  G --> H["User opens /sources/{slug}"]
  H --> I["Sources are built from currently included valid links"]
  I --> J["User expands a source"]
  J --> K["Source links display by published date, null last"]
```

## 5. Validation Gates

A task is not complete until relevant validation is run or explicitly documented as unavailable.

- Run unit/integration tests for changed app behavior.
- Run the TLA+ models when modifying specification or invariant-derived behavior.
- Confirm TLC does not report zero generated states.
- Update architecture documentation for meaningful feature/refactor work.
- Record any deleted or weakened validation criteria with the reason.
