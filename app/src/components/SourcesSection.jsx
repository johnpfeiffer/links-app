import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Link as MuiLink,
  List,
  ListItem,
  Typography,
} from "@mui/material";

function compareLinksByPublished(left, right) {
  const leftPublished = left?.published ?? null;
  const rightPublished = right?.published ?? null;

  if (leftPublished === null && rightPublished === null) {
    return 0;
  }
  if (leftPublished === null) {
    return 1;
  }
  if (rightPublished === null) {
    return -1;
  }
  if (leftPublished === rightPublished) {
    return 0;
  }

  return leftPublished.localeCompare(rightPublished);
}

export function buildDomainStats(links) {
  if (!Array.isArray(links)) {
    return [];
  }

  const domainGroups = new Map();

  links.forEach((link) => {
    const rawUrl = typeof link?.url === "string" ? link.url.trim() : "";
    if (!rawUrl) {
      console.warn("Skipping link without a URL for sources.", link);
      return;
    }

    try {
      const parsedUrl = new URL(rawUrl);
      const domain = parsedUrl.hostname.replace(/^www\./i, "");
      if (!domain) {
        console.warn("Skipping link with empty domain for sources.", rawUrl);
        return;
      }

      const existing = domainGroups.get(domain) ?? { domain, links: [] };
      existing.links.push(link);
      domainGroups.set(domain, existing);
    } catch (error) {
      console.warn(`Invalid URL in sources: ${rawUrl}`, error);
    }
  });

  return Array.from(domainGroups.values())
    .map((group) => ({
      domain: group.domain,
      count: group.links.length,
      links: [...group.links].sort(compareLinksByPublished),
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.domain.localeCompare(b.domain);
    });
}

export default function SourcesSection({ links }) {
  const [expandedDomains, setExpandedDomains] = useState(() => new Set());
  const domainStats = useMemo(() => buildDomainStats(links), [links]);

  const toggleDomain = (domain) => {
    setExpandedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) {
        next.delete(domain);
      } else {
        next.add(domain);
      }
      return next;
    });
  };

  if (domainStats.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Content Sources
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No sources available yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Content Sources
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Domains sorted by frequency of appearance
      </Typography>
      <Box>
        {domainStats.map((stat, index) => {
          const isExpanded = expandedDomains.has(stat.domain);
          return (
            <Accordion
              key={stat.domain}
              disableGutters
              elevation={0}
              expanded={isExpanded}
              onChange={() => toggleDomain(stat.domain)}
              sx={{
                bgcolor: "transparent",
                borderBottom: 1,
                borderColor: "divider",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {isExpanded ? "v" : ">"}
                  </Typography>
                }
                sx={{
                  cursor: "pointer",
                  flexDirection: "row-reverse",
                  gap: 1,
                  "& .MuiAccordionSummary-content": {
                    display: "grid",
                    gridTemplateColumns: "48px 1fr auto",
                    alignItems: "center",
                    gap: 2,
                  },
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  #{index + 1}
                </Typography>
                <MuiLink
                  href={`https://${stat.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                >
                  {stat.domain}
                </MuiLink>
                <Chip
                  label={`${stat.count} ${stat.count === 1 ? "link" : "links"}`}
                  size="small"
                  variant="outlined"
                  sx={{ justifySelf: "end" }}
                />
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <List dense sx={{ pt: 0 }}>
                  {stat.links.map((link) => (
                    <ListItem key={link.id ?? link.url} sx={{ px: 0 }}>
                      <MuiLink
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        underline="hover"
                        variant="body2"
                      >
                        {link.description ?? link.title}
                      </MuiLink>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
}
