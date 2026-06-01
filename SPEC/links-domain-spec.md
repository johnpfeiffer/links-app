# Links Domain Specification

This specification is derived from `/KERNEL/` and must not override it.

## Data Model

### Link

Trace: `INV-001`, `INV-002`, `INV-003`

A `Link` is a record with exactly these fields:

- `id`: non-empty string, unique across all links.
- `url`: non-empty string.
- `title`: non-empty string.
- `tags`: non-empty set of non-empty strings.

Invalid input records must not break the application. They may be skipped with console warnings, matching the requirements documents.

### Tag

Trace: `INV-004`, `INV-005`, `INV-006`

A tag has:

- a user-facing label string.
- a URL slug derived from the label.

Slug normalization is idempotent and must:

- lowercase input.
- remove special characters.
- convert whitespace to `-`.

Each tag slug identifies at most one tag label. Duplicate slugs in URL selection are invalid and should be canonicalized away rather than represented internally.

Every tag presented by the app must be connected to at least one `Link`, except the explicitly required favorite/popular tag section from `requirements-v4.md`, which may display fixed navigation tags even if no loaded link currently has that tag.

## Routing And Selection

Trace: `INV-006`, `INV-007`, `INV-008`

The URL drives the SPA. For the home links view:

- path segments after the application base are selected tag slugs.
- selected slugs are case-insensitive inputs and should be canonical lowercase output.
- generated tag URLs are lowercase canonical URLs.
- duplicate selected slugs should be removed from the canonical representation.

When selected slugs are present, a link is visible if at least one of its tag labels normalizes to one of the selected slugs.

When no slugs are selected, all links are visible.

## Views

### Home Links View

Derived from requirements v1 through v4:

- asynchronously load link content.
- show a loading state while content is pending.
- show favorite/popular tags above all tags: `AI`, `Business`, `Engineering`, `History`, `People`, `Podcast`.
- show all tags in an expandable section.
- show enabled tags after plain text `Filtered by`.
- show visible link count before the list.
- show each link title as a clickable URL with tags below.
- clicking a disabled tag appends that tag slug to the URL.
- clicking an enabled tag removes that slug from the URL.

### Sources View

Derived from requirements v5 and v6:

- route: `/sources` under the app base.
- aggregate all valid links by source domain.
- strip a leading `www.` from domains before grouping.
- handle invalid URLs with console warnings.
- sort domains by link count descending.
- show rank number and link count for each domain.
- allow each domain list to expand and collapse.
- provide navigation back to the home links view.

`requirements-v6.md` asks expanded source links to sort by published date ascending with null dates last. This depends on the unresolved `published` field conflict described in `SPEC/README.md`.

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
