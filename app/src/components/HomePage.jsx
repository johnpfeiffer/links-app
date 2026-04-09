import { Suspense, useEffect } from "react";
import {
  Await,
  Link as RouterLink,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { parseUrlPath } from "../lib/parseUrlPath";
import { collectTags, filterLinksByTags } from "../models/links";
import { buildTagsPath } from "../models/tags";
import FavoriteTagsSection from "./FavoriteTagsSection";
import AllTagsSection from "./AllTagsSection";
import LinksSection from "./LinksSection";
import Loading from "./Loading";

function buildSourcesPath(app) {
  const basePath = buildTagsPath(app, []);
  if (basePath === "/") {
    return "/sources";
  }
  return `${basePath}/sources`;
}

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData("root");
  const links = loaderData?.links ?? [];
  const { app, tags } = parseUrlPath(location.pathname);

  useEffect(() => {
    const canonicalPath = buildTagsPath(app, tags);
    const nextPath = `${canonicalPath}${location.search}${location.hash}`;
    if (nextPath !== `${location.pathname}${location.search}${location.hash}`) {
      navigate(nextPath, { replace: true });
    }
  }, [app, tags, location.pathname, location.search, location.hash, navigate]);

  return (
    <Container maxWidth={false} sx={{ width: "90%", mx: "auto", py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              John's favorite links
            </Typography>
            {app ? (
              <Button
                component={RouterLink}
                to={buildSourcesPath(app)}
                variant="outlined"
                size="small"
              >
                Sources
              </Button>
            ) : null}
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            A hand picked list of links for podcasts, blogs, and resources for Software Engineers, People Managers, and people who love to learn =)
          </Typography>
        </Box>
        <Suspense fallback={<Loading message="Loading categories and links..." />}>
          <Await resolve={links}>
            {(loadedLinks) => {
              const allTags = collectTags(loadedLinks);
              const tagByKey = new Map(allTags.map((tag) => [tag.key, tag]));
              const enabledTags = tags.map((tag) => tagByKey.get(tag.key) ?? tag);
              const filteredLinks = filterLinksByTags(loadedLinks, enabledTags);

              return (
                <>
                  <FavoriteTagsSection app={app} enabledTags={enabledTags} />
                  <AllTagsSection 
                    app={app}
                    enabledTags={enabledTags}
                    tags={allTags}
                  />
                  <LinksSection
                    app={app}
                    links={filteredLinks}
                    enabledTags={enabledTags}
                  />
                </>
              );
            }}
          </Await>
        </Suspense>
      </Paper>
    </Container>
  );
}
