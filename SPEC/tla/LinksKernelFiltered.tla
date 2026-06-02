-------------------------- MODULE LinksKernelFiltered -------------------------
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
       InitialSelectedSlugs <- SelectedSlugsFiltered,
       InitialAppName <- AppNameLinks,
       InitialRouteNamespace <- RouteTags,
       InitialDisplayedLinkCount <- DisplayedLinkCountFiltered,
       InitialIsAppBaseRoute <- IsAppBaseRouteFalse,
       InitialCanonicalPath <- CanonicalPathFiltered

=============================================================================
