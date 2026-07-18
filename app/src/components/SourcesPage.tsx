import { Suspense } from "react";
import {
  Await,
  Link as RouterLink,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";
import { Box, Button, Container, Paper } from "@mui/material";
import { parseUrlPath } from "../lib/parseUrlPath";
import { buildTagsPath } from "../models/tags";
import Loading from "./Loading";
import SourcesSection from "./SourcesSection";
import type { LinkRecord, RootLoaderData } from "../types";

export default function SourcesPage() {
  const location = useLocation();
  const loaderData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const links = loaderData?.links ?? [];
  const { app, tags } = parseUrlPath(location.pathname);
  const homePath = buildTagsPath(app, []);

  return (
    <Container maxWidth={false} sx={{ width: "90%", mx: "auto", py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            component={RouterLink}
            to={homePath}
            variant="outlined"
            size="small"
          >
            Back to home
          </Button>
        </Box>
        <Suspense fallback={<Loading message="Loading sources..." />}>
          <Await resolve={links}>
            {(loadedLinks: LinkRecord[]) => (
              <SourcesSection links={loadedLinks} selectedTags={tags} />
            )}
          </Await>
        </Suspense>
      </Paper>
    </Container>
  );
}
