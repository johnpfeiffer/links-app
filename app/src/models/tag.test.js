import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Tag } from "./tag.js";

describe("Tag.fromLabel", () => {
  it("normalizes labels and keys", () => {
    const tag = Tag.fromLabel("  Business   History ");

    assert.equal(tag.label, "Business History");
    assert.equal(tag.key, "business-history");
  });

  it("removes special characters from keys", () => {
    const tag = Tag.fromLabel("Example. #Tag-");

    assert.equal(tag.label, "Example Tag");
    assert.equal(tag.key, "example-tag");
  });

  it("collapses multiple dashes into a single separator", () => {
    const tag = Tag.fromLabel("Example---Tag");

    assert.equal(tag.label, "Example Tag");
    assert.equal(tag.key, "example-tag");
  });
});

describe("Tag.normalizeLabel", () => {
  it("collapses whitespace and trims edges", () => {
    assert.equal(Tag.normalizeLabel("  Business   History "), "Business History");
  });

  it("returns empty string for non-string input", () => {
    assert.equal(Tag.normalizeLabel(null), "");
    assert.equal(Tag.normalizeLabel(undefined), "");
    assert.equal(Tag.normalizeLabel(42), "");
  });
});

describe("Tag.fromSlug", () => {
  it("converts dashed slugs into tags", () => {
    const tag = Tag.fromSlug("Business-History");

    assert.equal(tag.label, "business history");
    assert.equal(tag.key, "business-history");
  });

  it("removes special characters from slugs", () => {
    const tag = Tag.fromSlug("Example.%20%23Tag-");

    assert.equal(tag.label, "example tag");
    assert.equal(tag.key, "example-tag");
  });

  it("returns null for empty or invalid slugs", () => {
    assert.equal(Tag.fromSlug(""), null);
    assert.equal(Tag.fromSlug("   "), null);
    assert.equal(Tag.fromSlug(null), null);
  });

  it("normalizes multiple dashes into single separators", () => {
    const tag = Tag.fromSlug("business---history");

    assert.equal(tag.label, "business history");
    assert.equal(tag.key, "business-history");
  });
});
