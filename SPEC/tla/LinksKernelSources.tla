--------------------------- MODULE LinksKernelSources -------------------------
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
       InitialSelectedSlugs <- SelectedSlugsSources,
       InitialAppName <- AppNameLinks,
       InitialRouteNamespace <- RouteSources,
       InitialDisplayedLinkCount <- DisplayedLinkCountSources,
       InitialIsAppBaseRoute <- IsAppBaseRouteFalse,
       InitialCanonicalPath <- CanonicalPathSources,
       InitialChatRecommendations <- ChatRecommendationsNone,
       InitialVisibleChatRecommendationCount <- VisibleChatRecommendationCountNone,
       InitialChatSubmitEnabled <- ChatSubmitEnabledTrue,
       InitialChatEnabled <- ChatEnabledTrue

=============================================================================
