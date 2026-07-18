import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { parseUrlPath } from "./parseUrlPath.js";
import { Tag } from "../models/tag.js";

describe("parseUrlPath", () => {
  it("parses the default route as Links View with no selected tags", () => {
    assert.deepEqual(parseUrlPath("/"), {
      app: "",
      routeNamespace: "default",
      view: "links",
      tags: [],
    });
    assert.deepEqual(parseUrlPath(""), {
      app: "",
      routeNamespace: "default",
      view: "links",
      tags: [],
    });
  });

  it("parses an application base route as Links View with no selected tags", () => {
    assert.deepEqual(parseUrlPath("/links/"), {
      app: "links",
      routeNamespace: "default",
      view: "links",
      tags: [],
    });
  });

  it("parses /tags route segments as selected tag slugs when app name is empty", () => {
    assert.deepEqual(parseUrlPath("/tags/engineering/architecture"), {
      app: "",
      routeNamespace: "tags",
      view: "links",
      tags: [Tag.fromSlug("engineering"), Tag.fromSlug("architecture")],
    });
  });

  it("parses /sources route segments as selected tag slugs when app name is empty", () => {
    assert.deepEqual(parseUrlPath("/sources/ai/podcast"), {
      app: "",
      routeNamespace: "sources",
      view: "sources",
      tags: [Tag.fromSlug("ai"), Tag.fromSlug("podcast")],
    });
  });

  it("parses route namespaces after the application name", () => {
    assert.deepEqual(parseUrlPath("/links/tags/engineering/architecture"), {
      app: "links",
      routeNamespace: "tags",
      view: "links",
      tags: [Tag.fromSlug("engineering"), Tag.fromSlug("architecture")],
    });
    assert.deepEqual(parseUrlPath("/links/sources/ai/podcast"), {
      app: "links",
      routeNamespace: "sources",
      view: "sources",
      tags: [Tag.fromSlug("ai"), Tag.fromSlug("podcast")],
    });
  });

  it("canonicalizes duplicate selected slugs after the route namespace", () => {
    assert.deepEqual(parseUrlPath("/links/tags/engineering/architecture/engineering"), {
      app: "links",
      routeNamespace: "tags",
      view: "links",
      tags: [Tag.fromSlug("engineering"), Tag.fromSlug("architecture")],
    });
  });
});
