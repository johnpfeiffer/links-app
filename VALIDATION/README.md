# Validation Obligations

This directory is AI-derived from `/KERNEL/`.

## Required Gates

- Existing tests must pass before work is marked complete.
- New high-value tests should be added for changed behavior.
- TLA+ models must generate at least one state; a zero-state TLC run is a failure.
- Any unverifiable requirement must be escalated rather than silently implemented.

## TLA+ Checks

Run from the repository root:

```bash
cd KERNEL
rtk uv run tla tlc ../SPEC/tla/LinksKernelAll
rtk uv run tla tlc ../SPEC/tla/LinksKernelFiltered
```

Expected result:

- TLC completes with all listed invariants satisfied.
- TLC reports at least one generated state.

## App Checks

Run from `app/`:

```bash
rtk npm test
rtk npm run test:vitest
```

Add or update tests in the smallest relevant layer before implementation changes.
