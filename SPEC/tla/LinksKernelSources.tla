--------------------------- MODULE LinksKernelSources -------------------------
EXTENDS LinksKernelModelData

VARIABLES links, selectedSlugs, appName, routeNamespace, displayedLinkCount,
          isAppBaseRoute, canonicalPath

INSTANCE LinksKernel
  WITH links <- links,
       selectedSlugs <- selectedSlugs,
       appName <- appName,
       routeNamespace <- routeNamespace,
       displayedLinkCount <- displayedLinkCount,
       isAppBaseRoute <- isAppBaseRoute,
       canonicalPath <- canonicalPath,
       InitialLinks <- ModelLinks,
       InitialSelectedSlugs <- SelectedSlugsSources,
       InitialAppName <- AppNameLinks,
       InitialRouteNamespace <- RouteSources,
       InitialDisplayedLinkCount <- DisplayedLinkCountSources,
       InitialIsAppBaseRoute <- IsAppBaseRouteFalse,
       InitialCanonicalPath <- CanonicalPathSources

=============================================================================
