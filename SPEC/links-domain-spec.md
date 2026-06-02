# Links Domain Specification

This specification is derived from `/KERNEL/` and must not override it.

## Data Model

### Link

Trace: `INV-001`, `INV-002`, `INV-003`, `INV-013`, `INV-014`

A loaded invariant `Link` is a record with exactly these fields:

- `id`: non-empty string, unique across all links.
- `url`: non-empty string.
- `title`: non-empty string.
- `tags`: non-empty set of non-empty strings.
- `published`: `null` when unknown, otherwise an ISO 8601 date string.
- `description`: non-empty trimmed string.

If source data omits `description`, the loaded link derives it from `title`. If a year can be derived from `published`, the description ends with that year as a single ` (YYYY)` suffix.

`createdAt` may exist as ingest/runtime metadata, but it is not part of the invariant `link` record and must not affect ids.

Invalid source records must not break the application. They may be skipped or normalized with console warnings, matching the requirements documents.

### Tag

Trace: `INV-004`, `INV-005`, `INV-006`

A tag has:

- a user-facing label string.
- a URL slug derived from the label.

Slug normalization is idempotent and must:

- lowercase input.
- strip special characters.
- replace whitespace with `-`.

Each slug identifies at most one tag label. Duplicate slugs in URL selection are invalid and should be canonicalized away rather than represented internally.

Every presented tag must be connected to at least one loaded link unless it is one of the favorite tags: `AI`, `Business`, `Engineering`, `History`, `People`, `Podcast`.

## Routing And Selection

Trace: `INV-006`, `INV-007`, `INV-008`, `INV-009`

The URL drives the SPA.

- `/` identifies the Links View with no selected tags.
- `/tags` identifies the Links View.
- `/sources` identifies the Sources View.
- route segments after the namespace are selected tag slugs.
- selected slugs are case-insensitive inputs and should be emitted in canonical lowercase form.
- duplicate selected slugs should be removed from the canonical representation.

When selected slugs are present, a link is included if at least one of its tag labels normalizes to one of the selected slugs.

When no slugs are selected, all links are included.

## Sources

Trace: `INV-010`, `INV-011`, `INV-012`

A `Source` is the canonical domain derived from a currently included link with a valid URL. Canonicalization strips a leading `www.` prefix. Invalid URLs do not produce Sources.

A link is a member of a Source if and only if:

- the link is currently included by `INV-007` or `INV-008`.
- the link URL is valid.
- the link canonical domain equals the Source.

A Source count equals its member link count. Sources with count `0` are not included in the current view.

## Views

### Links View

Derived from requirements v1 through v4:

- asynchronously load link content.
- show a loading state while content is pending.
- show favorite/popular tags above all tags: `AI`, `Business`, `Engineering`, `History`, `People`, `Podcast`.
- show all tags in an expandable section.
- show enabled tags after plain text `Filtered by`.
- show included link count before the list.
- show each link description as a clickable URL with tags below.
- clicking a disabled tag appends that tag slug to the URL.
- clicking an enabled tag removes that slug from the URL.

### Sources View

Derived from requirements v5 and v6:

- route namespace: `/sources`.
- aggregate currently included valid links by canonical source domain.
- sort domains by link count descending.
- show rank number and link count for each domain.
- allow each domain list to expand and collapse.
- show individual links in published date order, ascending, with null dates last.
- provide navigation back to the Links View.

## UI Constraints

Derived from requirements v2:

- plain white page background.
- tag controls use white backgrounds.
- base font size is 16px.
- layout uses at least 90% of screen width where practical.
- responsive behavior must remain usable on mobile and resized desktop windows.
- prefer ASCII over icons and images.

## Documentation Requirements

Derived from `/KERNEL/AGENTS.md` and `/KERNEL/README.md`:

- generated facts and decisions should be recorded in documentation.
- meaningful feature/refactor work should update architecture documentation with Mermaid diagrams for system design and user journey.
- unverifiable requirements must be escalated rather than silently converted into implementation work.
