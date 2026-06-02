------------------------- MODULE LinksKernelModelData -------------------------

\* Literal TLC model data only. Derived values stay in LinksKernel.tla.

ModelNull == "__NULL__"

ModelLinks == {
  [
    id |-> "link-1",
    url |-> "https://www.example.com/architecture",
    title |-> "Architecture Notes",
    tags |-> {"Engineering", "Architecture"},
    published |-> "2022-06-01",
    description |-> "Architecture Notes (2022)"
  ],
  [
    id |-> "link-2",
    url |-> "https://example.com/ai",
    title |-> "AI Podcast",
    tags |-> {"AI", "Podcast"},
    published |-> "2024-06-28T15:04:05Z",
    description |-> "AI Podcast (2024)"
  ],
  [
    id |-> "link-3",
    url |-> "not a url",
    title |-> "People History",
    tags |-> {"People", "History"},
    published |-> ModelNull,
    description |-> "People History"
  ]
}

SelectedSlugsAll == {}

SelectedSlugsFiltered == {"engineering"}

SelectedSlugsSources == {"ai"}

RouteDefault == "default"

RouteTags == "tags"

RouteSources == "sources"

=============================================================================
