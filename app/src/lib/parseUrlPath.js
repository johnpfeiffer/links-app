import { Tag } from "../models/tag.js";

const routeNamespaces = new Set(["tags", "sources"]);

function decodeSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch (error) {
    return segment;
  }
}

export function parseUrlPath(pathname = "") {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return {
      app: "",
      routeNamespace: "default",
      view: "links",
      tags: [],
    };
  }

  let app = "";
  let routeNamespace = "default";
  let tagSegments = [];

  if (routeNamespaces.has(segments[0])) {
    routeNamespace = segments[0];
    tagSegments = segments.slice(1);
  } else if (segments[1] && routeNamespaces.has(segments[1])) {
    app = decodeSegment(segments[0]);
    routeNamespace = segments[1];
    tagSegments = segments.slice(2);
  } else {
    app = decodeSegment(segments[0]);
  }

  const tags = [];
  const seen = new Set();

  tagSegments.forEach((segment) => {
    const tag = Tag.fromSlug(segment);
    if (!tag) return;
    if (seen.has(tag.key)) return;
    seen.add(tag.key);
    tags.push(tag);
  });

  return {
    app,
    routeNamespace,
    view: routeNamespace === "sources" ? "sources" : "links",
    tags,
  };
}
