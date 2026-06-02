# Links Derived Specification

This directory is AI-derived from `/KERNEL/` and is not authoritative. If any statement here conflicts with `/KERNEL/AGENTS.md`, `/KERNEL/INVARIANTS.md`, or the kernel requirements files, the kernel wins.

## Kernel Sources Read

- `/KERNEL/AGENTS.md`
- `/KERNEL/INVARIANTS.md`
- `/KERNEL/README.md`
- `/KERNEL/docs/requirements-v1.md`
- `/KERNEL/docs/requirements-v2.md`
- `/KERNEL/docs/requirements-v3.md`
- `/KERNEL/docs/requirements-v4.md`
- `/KERNEL/docs/requirements-v5.md`
- `/KERNEL/docs/requirements-v6.md`
- `/KERNEL/pyproject.toml`
- `/KERNEL/uv.lock`

## Derived Artifacts

- `links-domain-spec.md`: product/domain interpretation of the kernel.
- `implementation-plan.md`: red/green implementation and documentation plan.
- `tla/LinksKernel.tla`: TLA+ specification traced to `INV-001` through `INV-014`.
- `tla/LinksKernelModelData.tla`: literal TLC test data.
- `tla/LinksKernelAll.tla` and `tla/LinksKernelAll.cfg`: TLC model for the default no-filter links view.
- `tla/LinksKernelFiltered.tla` and `tla/LinksKernelFiltered.cfg`: TLC model for a filtered links view.
- `tla/LinksKernelSources.tla` and `tla/LinksKernelSources.cfg`: TLC model for a filtered sources view.

## Authority And Traceability

The current kernel invariants define:

- `INV-001`: Loaded link records have exactly `id`, `url`, `title`, `tags`, `published`, and `description`.
- `INV-002`: Link ids are unique.
- `INV-003`: Required link and tag values are non-empty.
- `INV-004`: Presented tags are link-connected unless they are favorite tags.
- `INV-005`: Tag labels normalize into idempotent URL slugs.
- `INV-006`: Slugs identify at most one tag and selected URL slugs do not duplicate.
- `INV-007`: A link is included when it matches at least one selected tag.
- `INV-008`: With no selected tags, all links are included.
- `INV-009`: Route namespaces precede selected tag slugs.
- `INV-010`: Sources derive from valid link URLs with `www.` stripped.
- `INV-011`: Source membership is exact over currently included links.
- `INV-012`: Source counts equal member counts, and zero-count sources are excluded.
- `INV-013`: Every link has `published`, either `null` or an ISO 8601 date string.
- `INV-014`: Every link has a non-empty trimmed `description` with published year suffix behavior.

## Scope Note

`createdAt` is mentioned by requirements as ingest/runtime metadata and is not part of the invariant `link` record in `INV-001`. Derived implementation work must not let `createdAt` affect ids, filtering, source membership, or any invariant-governed behavior.
