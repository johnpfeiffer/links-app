import { describe, expect, it } from "vitest";
import { Link } from "./link.js";
import { Tag } from "./tag.js";

describe("Link.loadAll", () => {
  it("loads content data via import.meta.glob", async () => {
    const links = await Link.loadAll();

    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
    expect(
      links.every(
        (link) =>
          typeof link.id === "string" &&
          link.id.length > 0 &&
          typeof link.description === "string" &&
          link.description.length > 0 &&
          typeof link.title === "string" &&
          link.title.length > 0 &&
          typeof link.url === "string" &&
          link.url.length > 0 &&
          (link.published === null || typeof link.published === "string") &&
          Array.isArray(link.tags) &&
          link.tags.length > 0
      )
    ).toBe(true);
    expect(
      links.every((link) => link.tags.every((tag) => tag instanceof Tag))
    ).toBe(true);
  });
});
