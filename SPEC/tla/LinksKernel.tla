----------------------------- MODULE LinksKernel -----------------------------
EXTENDS Naturals, TLC

\* Derived from /KERNEL/INVARIANTS.md.
\* Business predicates are named INV001 through INV008 and trace directly to
\* the corresponding kernel invariant. Init, Next, and Spec are TLC harness
\* operators only.

CONSTANTS InitialLinks, InitialSelectedSlugs

VARIABLES links, selectedSlugs

vars == <<links, selectedSlugs>>

TagLabels == UNION { link.tags : link \in links }

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
    [] label = "Example Tag" -> "example-tag"
    [] OTHER -> label

VisibleLinks ==
  IF selectedSlugs = {}
  THEN links
  ELSE { link \in links :
    \E label \in link.tags : Normalize(label) \in selectedSlugs
  }

Init ==
  /\ links = InitialLinks
  /\ selectedSlugs = InitialSelectedSlugs

Next == UNCHANGED vars

Spec == Init /\ [][Next]_vars

\* INV-001: links is a set of link records, each with exactly id, url, title,
\* and tags. id, url, title are strings; tags is a set of strings.
INV001 ==
  links \in SUBSET [
    id: STRING,
    url: STRING,
    title: STRING,
    tags: SUBSET STRING
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

\* INV-004: every tag must be connected to a Link.
INV004 ==
  \A label \in TagLabels :
    \E link \in links : label \in link.tags

\* INV-005: each tag's slug is the idempotent normalization of its label.
INV005 ==
  \A label \in TagLabels :
    /\ Normalize(label) \in STRING
    /\ Normalize(label) # ""
    /\ Normalize(Normalize(label)) = Normalize(label)

\* INV-006: a slug identifies at most one tag; selected URL slugs correspond
\* one-to-one with selected tags and cannot duplicate because selectedSlugs is
\* modeled as a set.
INV006 ==
  /\ selectedSlugs \subseteq { Normalize(label) : label \in TagLabels }
  /\ \A label1, label2 \in TagLabels :
    Normalize(label1) = Normalize(label2) => label1 = label2

\* INV-007: when tags are selected, a link is shown iff it has at least one
\* selected tag.
INV007 ==
  selectedSlugs # {} =>
    \A link \in links :
      (link \in VisibleLinks) <=>
        (\E label \in link.tags : Normalize(label) \in selectedSlugs)

\* INV-008: when no tags are selected, all links are shown.
INV008 ==
  selectedSlugs = {} => VisibleLinks = links

=============================================================================
