import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading({ message }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
      <CircularProgress size={20} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
