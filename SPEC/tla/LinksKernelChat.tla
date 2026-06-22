----------------------------- MODULE LinksKernelChat --------------------------
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
       InitialSelectedSlugs <- SelectedSlugsAll,
       InitialAppName <- AppNameLinks,
       InitialRouteNamespace <- RouteTags,
       InitialDisplayedLinkCount <- DisplayedLinkCountAll,
       InitialIsAppBaseRoute <- IsAppBaseRouteFalse,
       InitialCanonicalPath <- CanonicalPathAll,
       InitialChatRecommendations <- ChatRecommendationsMax,
       InitialVisibleChatRecommendationCount <- VisibleChatRecommendationCountMax,
       InitialChatSubmitEnabled <- ChatSubmitEnabledFalse,
       InitialChatEnabled <- ChatEnabledFalse

=============================================================================
