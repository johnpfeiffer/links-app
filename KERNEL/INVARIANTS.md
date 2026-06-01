# Invariants

Invariants are properties that must remain true across all derived artifacts and implementation work.

## INV-001: `links` is a set of `link` records, each with exactly the fields id, url, title (strings) and tags (a set of strings).

## INV-002: Unique id: no two distinct links share an id.

## INV-003: Required and non-empty: every link's id, url, and title are non-empty. It has at least one tag, and every tag (string) is non-empty.

## INV-004: Every tag must be connected to a Link.

## INV-005 Each tag becomes a url slug: each tag's slug is the idempotent normalization (lowercase, strip special chars, whitespace becomes '-') of its label.

## INV-006: a slug identifies at most one tag across the set of tags. The slugs in the URL and selected tags are in a one to one correspondance. Therefore a slug should not be duplicated in the URL.

## INV-007: A link is shown if it has at least one of the selected tags. Selection can be through the slug or the UI

## INV-008: When no tags are selected, all links are shown.

