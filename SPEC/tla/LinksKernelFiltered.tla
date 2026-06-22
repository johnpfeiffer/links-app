-------------------------- MODULE LinksKernelFiltered -------------------------
EXTENDS LinksKernelModelData

VARIABLES links, selectedSlugs, appName, routeNamespace, displayedLinkCount,
          isAppBaseRoute, canonicalPath, chatRecommendations,
          visibleChatRecommendationCount, chatSubmitEnabled, chatEnabled

INSTANCE LinksKernel
  WITH links <- links,
       selectedSlugs <- selectedSlugs,
       appName <- appName,
       routeNamespace <- routeNamespace,
       displayedLinkCount <- displayedLinkCount,
       isAppBaseRoute <- isAppBaseRoute,
       canonicalPath <- canonicalPath,
       chatRecommendations <- chatRecommendations,
       visibleChatRecommendationCount <- visibleChatRecommendationCount,
       chatSubmitEnabled <- chatSubmitEnabled,
       chatEnabled <- chatEnabled,
       InitialLinks <- ModelLinks,
       InitialSelectedSlugs <- SelectedSlugsFiltered,
       InitialAppName <- AppNameLinks,
       InitialRouteNamespace <- RouteTags,
       InitialDisplayedLinkCount <- DisplayedLinkCountFiltered,
       InitialIsAppBaseRoute <- IsAppBaseRouteFalse,
       InitialCanonicalPath <- CanonicalPathFiltered,
       InitialChatRecommendations <- ChatRecommendationsNone,
       InitialVisibleChatRecommendationCount <- VisibleChatRecommendationCountNone,
       InitialChatSubmitEnabled <- ChatSubmitEnabledTrue,
       InitialChatEnabled <- ChatEnabledTrue

=============================================================================
