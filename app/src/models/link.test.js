import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Link } from "./link.js";
import { Tag } from "./tag.js";

describe("Link", () => {
  it("sets expected fields with defaults", () => {
    const link = new Link({
      id: "link-1",
      title: "Example",
      url: "https://example.com",
      tags: [Tag.fromLabel("Tag")],
    });

    assert.equal(link.id, "link-1");
    assert.equal(link.title, "Example");
    assert.equal(link.description, "Example");
    assert.equal(link.url, "https://example.com");
    assert.deepEqual(
      link.tags.map((tag) => tag.label),
      ["Tag"]
    );
    assert.equal(typeof link.createdAt, "string");
    assert.equal(link.published, null);
  });
});

describe("Link.from", () => {
  it("trims fields and drops invalid tags", () => {
    const link = Link.from({
      title: "  Good ",
      url: " https://example.com ",
      tags: [" TagOne ", "tagTwo", "   ", 123],
    });

    assert.equal(link.title, "Good");
    assert.equal(link.url, "https://example.com");
    assert.deepEqual(
      link.tags.map((tag) => tag.label),
      ["TagOne", "tagTwo"]
    );
  });

  it("appends the published year to the description", () => {
    const link = Link.from({
      title: "Example title",
      url: "https://example.com",
      published: "2000-01-01",
      tags: ["Tag"],
    });

    assert.equal(link.published, "2000-01-01");
    assert.equal(link.description, "Example title (2000)");
    assert.equal(link.title, "Example title");
  });

  it("handles published and description edge cases (table driven)", () => {
    const cases = [
      {
        name: "null published leaves description untouched",
        input: { description: "Already fine", published: null },
        expected: { description: "Already fine", published: null },
      },
      {
        name: "description already includes year suffix",
        input: { description: "Already fine (2000)", published: "2000-01-01" },
        expected: { description: "Already fine (2000)" },
      },
      {
        name: "invalid published value becomes null",
        input: { description: "Example", published: 123 },
        expected: { description: "Example", published: null },
      },
      {
        name: "blank description falls back to title",
        input: { description: "   ", published: "1999-12-31" },
        expected: { description: "Example title (1999)" },
      },
    ];

    cases.forEach(({ name, input, expected }) => {
      const link = Link.from({
        title: "Example title",
        url: "https://example.com",
        tags: ["Tag"],
        ...input,
      });

      assert.equal(link.description, expected.description, name);
      if ("published" in expected) {
        assert.equal(link.published, expected.published, name);
      }
    });
  });

  it("returns null for missing required fields", () => {
    assert.equal(Link.from({ title: "No url", tags: ["Tag"] }), null);
    assert.equal(Link.from({ url: "https://example.com", tags: ["Tag"] }), null);
    assert.equal(
      Link.from({ url: "https://example.com", title: "No tags" }),
      null
    );
  });

  it("returns null for non-object input", () => {
    [null, undefined, "string", 42].forEach((input) => {
      assert.equal(Link.from(input), null, `expected null for ${input}`);
    });
  });

  it("deduplicates tags by key", () => {
    const link = Link.from({
      title: "Example",
      url: "https://example.com",
      tags: ["AI", "ai", " AI "],
    });

    assert.equal(link.tags.length, 1);
    assert.equal(link.tags[0].label, "AI");
  });
});
