import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { buildTagTogglePath } from "../models/tags";
import LinksList from "./LinksList";

export default function LinksSection({ app, links, enabledTags }) {
  return (
    <Box>
      {enabledTags.length > 0 ? (
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Filtered by
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap", alignItems: "center" }}
          >
            {enabledTags.map((tag) => {
              const to = buildTagTogglePath(app, enabledTags, tag);

              return (
                <Chip
                  key={tag.key}
                  label={tag.label}
                  size="small"
                  variant="outlined"
                  color="primary"
                  clickable
                  component={RouterLink}
                  to={to}
                  sx={{ bgcolor: "common.white" }}
                />
              );
            })}
          </Stack>
        </Box>
      ) : null}
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Showing <b>{links.length}</b> links
      </Typography>
      <Divider sx={{ my: 2 }} />
      <LinksList app={app} enabledTags={enabledTags} links={links} />
    </Box>
  );
}
