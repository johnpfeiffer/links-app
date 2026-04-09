import { Tag } from "../models/tag.js";

export function parseUrlPath(pathname = "") {
  const segments = pathname.split("/").filter(Boolean);
  const appSegment = segments[0] || "";
  let app = appSegment;
  try {
    app = decodeURIComponent(appSegment);
  } catch (error) {
    app = appSegment;
  }

  const tags = [];
  const seen = new Set();

  segments.slice(1).forEach((segment) => {
    const tag = Tag.fromSlug(segment);
    if (!tag) return;
    if (seen.has(tag.key)) return;
    seen.add(tag.key);
    tags.push(tag);
  });

  return { app, tags };
}
