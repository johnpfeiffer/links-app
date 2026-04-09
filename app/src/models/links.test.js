import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectTags, filterLinksByTags } from "./links.js";
import { Link } from "./link.js";
import { Tag } from "./tag.js";

describe("Link.normalizeAll", () => {
  it("skips invalid links and normalizes required fields", () => {
    const createdIds = [];
    const createId = () => {
      const nextId = `id-${createdIds.length + 1}`;
      createdIds.push(nextId);
      return nextId;
    };
    const rawLinks = [
      {
        title: "  Good ",
        url: " https://example.com ",
        tags: [" TagOne ", "tagTwo"],
      },
      {
        title: "",
        url: "https://bad.example.com",
        tags: ["Bad"],
      },
      {
        title: "Missing tags",
        url: "https://missing.example.com",
      },
    ];

    const normalized = Link.normalizeAll(rawLinks, { createId });

    assert.equal(normalized.length, 1);
    assert.equal(normalized[0].id, "id-1");
    assert.equal(normalized[0].title, "Good");
    assert.equal(normalized[0].url, "https://example.com");
    assert.deepEqual(
      normalized[0].tags.map((tag) => tag.label),
      ["TagOne", "tagTwo"]
    );
  });

  it("ensures ids are unique when duplicates appear", () => {
    const rawLinks = [
      {
        id: "same",
        title: "Link One",
        url: "https://one.example.com",
        tags: ["One"],
      },
      {
        id: "same",
        title: "Link Two",
        url: "https://two.example.com",
        tags: ["Two"],
      },
    ];

    const normalized = Link.normalizeAll(rawLinks, {
      createId: () => "generated",
    });

    assert.equal(normalized.length, 2);
    assert.equal(normalized[0].id, "same");
    assert.equal(normalized[1].id, "generated");
  });
});

describe("filterLinksByTags", () => {
  it("filters links by all requested tags (case-insensitive)", () => {
    const links = [
      {
        id: "1",
        title: "One",
        url: "https://one",
        tags: [Tag.fromLabel("AI"), Tag.fromLabel("Podcast")],
      },
      {
        id: "2",
        title: "Two",
        url: "https://two",
        tags: [Tag.fromLabel("AI")],
      },
    ];

    const filtered = filterLinksByTags(links, [
      Tag.fromLabel("ai"),
      Tag.fromLabel("podcast"),
    ]);

    assert.deepEqual(filtered.map((link) => link.id), ["1"]);
  });

  it("returns all links when tags is empty or null", () => {
    const links = [
      {
        id: "1",
        title: "One",
        url: "https://one",
        tags: [Tag.fromLabel("AI")],
      },
      {
        id: "2",
        title: "Two",
        url: "https://two",
        tags: [Tag.fromLabel("News")],
      },
    ];

    [[], null, undefined].forEach((tags) => {
      const result = filterLinksByTags(links, tags);
      assert.equal(result.length, 2, `expected all links for tags=${tags}`);
    });
  });
});

describe("collectTags", () => {
  it("returns unique tags sorted alphabetically", () => {
    const links = [
      {
        id: "1",
        title: "One",
        url: "https://one",
        tags: [Tag.fromLabel("AI"), Tag.fromLabel("Podcast")],
      },
      {
        id: "2",
        title: "Two",
        url: "https://two",
        tags: [Tag.fromLabel("ai"), Tag.fromLabel("News")],
      },
    ];

    const tags = collectTags(links);

    assert.deepEqual(
      tags.map((tag) => tag.label),
      ["AI", "News", "Podcast"]
    );
  });

  it("returns empty array for empty links", () => {
    assert.deepEqual(collectTags([]), []);
  });
});
