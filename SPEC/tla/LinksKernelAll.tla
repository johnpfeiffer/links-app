----------------------------- MODULE LinksKernelAll ---------------------------
EXTENDS LinksKernelModelData

VARIABLES links, selectedSlugs, routeNamespace, displayedLinkCount

INSTANCE LinksKernel
  WITH links <- links,
       selectedSlugs <- selectedSlugs,
       routeNamespace <- routeNamespace,
       displayedLinkCount <- displayedLinkCount,
       InitialLinks <- ModelLinks,
       InitialSelectedSlugs <- SelectedSlugsAll,
       InitialRouteNamespace <- RouteDefault,
       InitialDisplayedLinkCount <- DisplayedLinkCountAll

=============================================================================
