--------------------------- MODULE LinksKernelSources -------------------------
EXTENDS LinksKernelModelData

VARIABLES links, selectedSlugs, routeNamespace

INSTANCE LinksKernel
  WITH links <- links,
       selectedSlugs <- selectedSlugs,
       routeNamespace <- routeNamespace,
       InitialLinks <- ModelLinks,
       InitialSelectedSlugs <- SelectedSlugsSources,
       InitialRouteNamespace <- RouteSources

=============================================================================
