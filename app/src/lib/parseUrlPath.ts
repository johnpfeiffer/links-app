import { Tag } from "../models/tag";
import type { ParsedUrlPath, TagRecord } from "../types";

const routeNamespaces = new Set<"tags" | "sources">(["tags", "sources"]);

function isRouteNamespace(value: string): value is "tags" | "sources" {
  return routeNamespaces.has(value as "tags" | "sources");
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch (error) {
    return segment;
  }
}

export function parseUrlPath(pathname = ""): ParsedUrlPath {
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
  let routeNamespace: ParsedUrlPath["routeNamespace"] = "default";
  let tagSegments: string[] = [];

  const firstSegment = segments[0];
  const secondSegment = segments[1];

  if (firstSegment && isRouteNamespace(firstSegment)) {
    routeNamespace = firstSegment;
    tagSegments = segments.slice(1);
  } else if (firstSegment && secondSegment && isRouteNamespace(secondSegment)) {
    app = decodeSegment(firstSegment);
    routeNamespace = secondSegment;
    tagSegments = segments.slice(2);
  } else {
    app = decodeSegment(firstSegment ?? "");
  }

  const tags: TagRecord[] = [];
  const seen = new Set<string>();

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
