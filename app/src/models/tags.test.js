import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Tag } from "./tag.js";
import {
  buildTagsPath,
  buildTagTogglePath,
  isTagEnabled,
} from "./tags.js";

describe("isTagEnabled", () => {
  it("matches tags case-insensitively", () => {
    assert.equal(
      isTagEnabled([Tag.fromLabel("AI"), Tag.fromLabel("Podcast")], Tag.fromLabel("ai")),
      true
    );
    assert.equal(
      isTagEnabled([Tag.fromLabel("AI"), Tag.fromLabel("Podcast")], Tag.fromLabel("news")),
      false
    );
  });
});

describe("buildTagsPath", () => {
  it("builds a path with app and tags", () => {
    const tags = [Tag.fromLabel("ai"), Tag.fromLabel("podcast")];
    assert.equal(buildTagsPath("myapp", tags), "/myapp/ai/podcast");
  });

  it("replaces whitespace with dashes", () => {
    assert.equal(
      buildTagsPath("myapp", [Tag.fromLabel("Business History"), Tag.fromLabel("AI")]),
      "/myapp/business-history/ai"
    );
  });

  it("builds a path without an app", () => {
    assert.equal(buildTagsPath("", [Tag.fromLabel("ai")]), "/ai");
  });
});

describe("buildTagTogglePath", () => {
  it("adds a tag to the end when disabled", () => {
    const enabled = [Tag.fromLabel("tag1")];
    const next = buildTagTogglePath("myapp", enabled, Tag.fromLabel("tag2"));

    assert.equal(next, "/myapp/tag1/tag2");
  });

  it("removes a tag when enabled", () => {
    const enabled = [Tag.fromLabel("tag1"), Tag.fromLabel("tag2")];
    const next = buildTagTogglePath("myapp", enabled, Tag.fromLabel("tag1"));

    assert.equal(next, "/myapp/tag2");
  });
});
