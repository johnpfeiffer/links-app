import { Suspense } from "react";
import {
  Await,
  Link as RouterLink,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { Box, Button, Container, Paper } from "@mui/material";
import { buildTagsPath } from "../models/tags";
import Loading from "./Loading";
import SourcesSection from "./SourcesSection";

function normalizeAppParam(value) {
  if (typeof value !== "string") return "";
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

export default function SourcesPage() {
  const loaderData = useRouteLoaderData("root");
  const links = loaderData?.links ?? [];
  const params = useParams();
  const app = normalizeAppParam(params.app);
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
            {(loadedLinks) => <SourcesSection links={loadedLinks} />}
          </Await>
        </Suspense>
      </Paper>
    </Container>
  );
}
