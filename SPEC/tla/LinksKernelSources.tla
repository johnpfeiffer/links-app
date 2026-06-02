--------------------------- MODULE LinksKernelSources -------------------------
EXTENDS LinksKernelModelData

VARIABLES links, selectedSlugs, routeNamespace, displayedLinkCount

INSTANCE LinksKernel
  WITH links <- links,
       selectedSlugs <- selectedSlugs,
       routeNamespace <- routeNamespace,
       displayedLinkCount <- displayedLinkCount,
       InitialLinks <- ModelLinks,
       InitialSelectedSlugs <- SelectedSlugsSources,
       InitialRouteNamespace <- RouteSources,
       InitialDisplayedLinkCount <- DisplayedLinkCountSources

=============================================================================
