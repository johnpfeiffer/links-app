------------------------- MODULE LinksKernelModelData -------------------------

\* Literal TLC model data only. Derived values stay in LinksKernel.tla.

ModelLinks == {
  [
    id |-> "link-1",
    url |-> "https://example.com/architecture",
    title |-> "Architecture Notes",
    tags |-> {"Engineering", "Architecture"}
  ],
  [
    id |-> "link-2",
    url |-> "https://example.com/ai",
    title |-> "AI Podcast",
    tags |-> {"AI", "Podcast"}
  ],
  [
    id |-> "link-3",
    url |-> "https://example.com/history",
    title |-> "People History",
    tags |-> {"People", "History"}
  ]
}

SelectedSlugsAll == {}

SelectedSlugsFiltered == {"engineering"}

=============================================================================
