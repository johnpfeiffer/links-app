----------------------------- MODULE LinksKernel -----------------------------
EXTENDS Naturals, FiniteSets, TLC

\* Derived from /KERNEL/INVARIANTS.md.
\* Business predicates are named INV001 through INV016 and trace directly to
\* the corresponding kernel invariant. Init, Next, and Spec are TLC harness
\* operators only.

CONSTANTS InitialLinks, InitialSelectedSlugs, InitialRouteNamespace,
          InitialDisplayedLinkCount

VARIABLES links, selectedSlugs, routeNamespace, displayedLinkCount

vars == <<links, selectedSlugs, routeNamespace, displayedLinkCount>>

\* TLC model sentinel for kernel null.
NullValue == "__NULL__"

FavoriteTagLabels ==
  {"AI", "Business", "Engineering", "History", "People", "Podcast", "Book"}

RouteNamespaces == {"default", "tags", "sources"}

TagLabels == UNION { link.tags : link \in links }

PresentedTagLabels == TagLabels \cup FavoriteTagLabels

\* Bounded normalization for the literal labels used by the TLC model files.
\* This operator exists so model files contain only literal test data.
Normalize(label) ==
  CASE label = "AI" -> "ai"
    [] label = "Business" -> "business"
    [] label = "Engineering" -> "engineering"
    [] label = "Architecture" -> "architecture"
    [] label = "History" -> "history"
    [] label = "People" -> "people"
    [] label = "Podcast" -> "podcast"
    [] label = "Book" -> "book"
    [] label = "Example Tag" -> "example-tag"
    [] OTHER -> label

IncludedLinks ==
  IF selectedSlugs = {}
  THEN links
  ELSE { link \in links :
    \A slug \in selectedSlugs :
      \E label \in link.tags : Normalize(label) = slug
  }

PublishedValues ==
  {
    NullValue,
    "2022-06-01",
    "2024-06-28T15:04:05Z",
    "2020-10-15"
  }

IsIsoPublished(value) ==
  value \in PublishedValues /\ value # NullValue

PublishedYear(value) ==
  CASE value = "2022-06-01" -> "2022"
    [] value = "2024-06-28T15:04:05Z" -> "2024"
    [] value = "2020-10-15" -> "2020"
    [] OTHER -> NullValue

TrimmedDescriptions ==
  {
    "Architecture Notes (2022)",
    "AI Podcast (2024)",
    "People History"
  }

AlternateUrlValues ==
  {
    "",
    "https://alt.example.com/architecture"
  }

DescriptionHasPublishedYearSuffix(description, published) ==
  CASE PublishedYear(published) = "2022" -> description = "Architecture Notes (2022)"
    [] PublishedYear(published) = "2024" -> description = "AI Podcast (2024)"
    [] PublishedYear(published) = "2020" -> description = "People History (2020)"
    [] OTHER -> TRUE

HasRepeatedPublishedYearSuffix(description, published) ==
  CASE PublishedYear(published) = "2022" -> description = "Architecture Notes (2022) (2022)"
    [] PublishedYear(published) = "2024" -> description = "AI Podcast (2024) (2024)"
    [] PublishedYear(published) = "2020" -> description = "People History (2020) (2020)"
    [] OTHER -> FALSE

CanonicalDomain(url) ==
  CASE url = "https://www.example.com/architecture" -> "example.com"
    [] url = "https://example.com/ai" -> "example.com"
    [] OTHER -> NullValue

ValidUrl(url) == CanonicalDomain(url) # NullValue

SourceDomainUniverse == {"example.com"}

Sources ==
  { domain \in SourceDomainUniverse :
    \E link \in IncludedLinks :
      /\ ValidUrl(link.url)
      /\ CanonicalDomain(link.url) = domain
  }

SourceMembers(source) ==
  { link \in IncludedLinks :
    /\ ValidUrl(link.url)
    /\ CanonicalDomain(link.url) = source
  }

SourceCount(source) == Cardinality(SourceMembers(source))

Init ==
  /\ links = InitialLinks
  /\ selectedSlugs = InitialSelectedSlugs
  /\ routeNamespace = InitialRouteNamespace
  /\ displayedLinkCount = InitialDisplayedLinkCount

Next == UNCHANGED vars

Spec == Init /\ [][Next]_vars

\* INV-001: links is a set of link records, each with exactly id, url, title,
\* tags, published, description, and alternate-url. TLA+ field names cannot
\* contain "-", so alternateUrl is the TLA-safe spelling of alternate-url.
INV001 ==
  links \in SUBSET [
    id: STRING,
    url: STRING,
    title: STRING,
    tags: SUBSET STRING,
    published: PublishedValues,
    description: STRING,
    alternateUrl: AlternateUrlValues
  ]

\* INV-002: no two distinct links share an id.
INV002 ==
  \A l1, l2 \in links : l1 # l2 => l1.id # l2.id

\* INV-003: every link's id, url, and title are non-empty. It has at least
\* one tag, and every tag is non-empty.
INV003 ==
  \A link \in links :
    /\ link.id # ""
    /\ link.url # ""
    /\ link.title # ""
    /\ link.tags # {}
    /\ \A label \in link.tags : label # ""

\* INV-004: every presented tag is connected to a Link unless it is a favorite
\* tag.
INV004 ==
  \A label \in PresentedTagLabels :
    \/ label \in FavoriteTagLabels
    \/ \E link \in links : label \in link.tags

\* INV-005: each tag's slug is the idempotent normalization of its label.
INV005 ==
  \A label \in PresentedTagLabels :
    /\ Normalize(label) \in STRING
    /\ Normalize(label) # ""
    /\ Normalize(Normalize(label)) = Normalize(label)

\* INV-006: a slug identifies at most one tag; selected URL slugs correspond
\* one-to-one with selected tags and cannot duplicate because selectedSlugs is
\* modeled as a set.
INV006 ==
  /\ selectedSlugs \subseteq { Normalize(label) : label \in PresentedTagLabels }
  /\ \A label1, label2 \in PresentedTagLabels :
    Normalize(label1) = Normalize(label2) => label1 = label2

\* INV-007: when tags are selected, a link is included iff it contains every
\* selected tag.
INV007 ==
  selectedSlugs # {} =>
    \A link \in links :
      (link \in IncludedLinks) <=>
        (\A slug \in selectedSlugs :
          \E label \in link.tags : Normalize(label) = slug)

\* INV-008: when no tags are selected, all links are included.
INV008 ==
  selectedSlugs = {} => IncludedLinks = links

\* INV-009: links count is exactly the count of unique included links.
INV009 ==
  displayedLinkCount = Cardinality(IncludedLinks)

\* INV-010: route namespaces precede selected slugs. The default route has no
\* selected tags.
INV010 ==
  /\ routeNamespace \in RouteNamespaces
  /\ routeNamespace = "default" => selectedSlugs = {}

\* INV-011: sources are canonical domains derived from valid included link URLs;
\* invalid URLs do not produce sources.
INV011 ==
  Sources =
    { domain \in SourceDomainUniverse :
      \E link \in IncludedLinks :
        /\ ValidUrl(link.url)
        /\ CanonicalDomain(link.url) = domain
    }

\* INV-012: source membership is exact for valid currently included links.
INV012 ==
  \A source \in SourceDomainUniverse :
    \A link \in links :
      (link \in SourceMembers(source)) <=>
        /\ link \in IncludedLinks
        /\ ValidUrl(link.url)
        /\ CanonicalDomain(link.url) = source

\* INV-013: source count equals member count, and only positive-count sources
\* are included in a view.
INV013 ==
  \A source \in SourceDomainUniverse :
    /\ SourceCount(source) = Cardinality(SourceMembers(source))
    /\ (source \in Sources) <=> SourceCount(source) > 0

\* INV-014: every link has published as null or an ISO 8601 date string.
INV014 ==
  \A link \in links :
    \/ link.published = NullValue
    \/ IsIsoPublished(link.published)

\* INV-015: every link has a non-empty trimmed description. If a year can be
\* derived from published, the description ends with exactly one matching suffix.
INV015 ==
  \A link \in links :
    /\ link.description \in TrimmedDescriptions
    /\ link.description # ""
    /\ DescriptionHasPublishedYearSuffix(link.description, link.published)
    /\ ~HasRepeatedPublishedYearSuffix(link.description, link.published)

\* INV-016: every link has alternate-url as a URL or empty string.
INV016 ==
  \A link \in links : link.alternateUrl \in AlternateUrlValues

=============================================================================
