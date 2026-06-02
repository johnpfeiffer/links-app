# Invariants

Invariants are properties that must remain true across all derived artifacts and implementation work.

## INV-001: `links` is a set of `link` records, each with exactly the fields id, url, title (strings) and tags (a set of strings),
 and published (see INV-014), and description (see INV-014), and alternate-url (see INV-016)

## INV-002: Unique id: no two distinct links share an id.

## INV-003: Required and non-empty: every link's id, url, and title are non-empty. It has at least one tag, and every tag (string) is non-empty.

## INV-004: Every tag must be connected to a Link; unless it is part of the set of Favorite Tags: AI, Business, Engineering, History, People, Podcast, Book

## INV-005 Each tag becomes a url slug: each tag's slug is the idempotent normalization of its label: lowercase, strip special characters, and replace whitespace with `-`.

## INV-006: a slug identifies at most one tag across the set of tags. The slugs in the URL and selected tags are in a one to one correspondence. Therefore a slug should not be duplicated in the URL.

## INV-007: A link is included in the current selection if it contains every one of the selected tags. Selection can be through the slug or the UI.

## INV-008: When no tags are selected, all links are included.

## INV-009: Links count is exactly the count of unique links included by tag selection.

## INV-010: There are application URL route namespaces that precede any slugs
- `/tags` identifies the Links View
- `/sources` identifies the Sources View
- Route segments after the namespace are interpreted as selected tag slugs.
- The default route `/` identifies the Links View with no selected tags.

## INV-011: Sources are derived from valid Link URLs.
A Source is the canonical domain derived from one or more valid Link URLs. Canonicalization strips a leading `www.` prefix. Invalid URLs do not produce Sources.

## INV-012: Source membership
A Link is a member of a Source if and only if the Link has a valid URL, its canonical domain equals that Source, and if it is currently included (INV-007 or INV-008).

## INV-013: Source count and inclusion
A Source count equals the count of member Links. Only Sources with count greater than zero are included in a given view.

## INV-014: Published attribute
- Every link includes a "published" field, when it is unknown or invalid, set published to null
- "published" is an ISO 8601 date string (e.g. "2024-06-28" or "2024-06-28T15:04:05Z")
- "published" is separate from "createdAt" (ingest time) and does not affect ids.

## INV-015: Description attribute
- Every Link has a non-empty, trimmed description.
- If a year can be derived from published, the description ends with, exactly once, that year as a single (YYYY) suffix.
- The description never ends with a repeated (YYYY) suffix.

## INV-016: Alternate-URL attribute
- Every link has an Alternate-URL field that can be a url or an empty string

