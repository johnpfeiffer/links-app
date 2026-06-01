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
- `tla/LinksKernel.tla`: TLA+ specification traced to `INV-001` through `INV-008`.
- `tla/LinksKernelModelData.tla`: literal TLC test data.
- `tla/LinksKernelAll.tla` and `tla/LinksKernelAll.cfg`: TLC model for the no-filter case.
- `tla/LinksKernelFiltered.tla` and `tla/LinksKernelFiltered.cfg`: TLC model for the filtered case.

## Authority And Traceability

The kernel invariants are the highest priority technical constraints for generated artifacts:

- `INV-001`: Link record fields and tag shape.
- `INV-002`: Link ids are unique.
- `INV-003`: Required link and tag values are non-empty.
- `INV-004`: Tags are connected to links.
- `INV-005`: Tag labels normalize into idempotent URL slugs.
- `INV-006`: Slugs identify at most one tag and URL selected tags do not duplicate.
- `INV-007`: A link is visible when it matches at least one selected tag.
- `INV-008`: With no selected tags, all links are visible.

## Open Kernel Conflict

`INV-001` says each `link` record has exactly `id`, `url`, `title`, and `tags`. `requirements-v6.md` asks to add a `published` attribute to every `Link`.

Until a human updates the kernel to reconcile that conflict, these derived specs treat `published` as a product requirement that needs escalation before it can be added to the invariant-governed `link` record. Implementation work can still document the conflict and avoid weakening `INV-001`.
