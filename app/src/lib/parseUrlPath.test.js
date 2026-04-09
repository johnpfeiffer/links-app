import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseUrlPath } from "./parseUrlPath.js";
import { Tag } from "../models/tag.js";

describe("parseUrlPath", () => {
  it("extracts app and tags from a full path", () => {
    assert.deepEqual(parseUrlPath("/myrouter/engineering/architecture"), {
      app: "myrouter",
      tags: [Tag.fromSlug("engineering"), Tag.fromSlug("architecture")],
    });
  });

  it("handles duplicates", () => {
    assert.deepEqual(parseUrlPath("/myrouter/engineering/architecture/engineering"), {
      app: "myrouter",
      tags: [Tag.fromSlug("engineering"), Tag.fromSlug("architecture")],
    });
  });

  it("converts dashed tags into spaced tags", () => {
    assert.deepEqual(parseUrlPath("/myrouter/Business-History"), {
      app: "myrouter",
      tags: [Tag.fromSlug("Business-History")],
    });
  });

  it("handles an app-only path", () => {
    assert.deepEqual(parseUrlPath("/myrouter/"), {
      app: "myrouter",
      tags: [],
    });
  });

  it("handles empty or root paths", () => {
    assert.deepEqual(parseUrlPath("/"), { app: "", tags: [] });
    assert.deepEqual(parseUrlPath(""), { app: "", tags: [] });
  });
});
