import { Box, Chip, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Tag } from "../models/tag";
import { buildTagTogglePath, isTagEnabled } from "../models/tags";
import type { TagRecord } from "../types";

const favoriteTagLabels = ["AI", "Business", "Engineering", "History", "People", "Podcast", "Book"];
const favoriteTags: TagRecord[] = favoriteTagLabels
  .map((label) => Tag.fromLabel(label))
  .filter((tag): tag is Tag => tag !== null);

export default function FavoriteTagsSection({ app, enabledTags }: { app: string; enabledTags: TagRecord[] }) {
  return (
    <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }} data-testid="favorite-tags">
      <Typography variant="body2" color="text.secondary">
        Favorite and popular tags
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", alignItems: "center" }}>
        {favoriteTags.map((tag) => {
          const enabled = isTagEnabled(enabledTags, tag);
          const to = buildTagTogglePath(app, enabledTags, tag);

          return (
            <Chip
              key={tag.key}
              label={tag.label}
              size="small"
              variant="outlined"
              color={enabled ? "primary" : "default"}
              clickable
              component={RouterLink}
              to={to}
              sx={{ bgcolor: "common.white" }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
