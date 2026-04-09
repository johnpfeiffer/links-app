import { Tag } from "./tag.js";

// ---- Remote singleton (module scope) ----
const REMOTE_BASE_URL =
  "https://raw.githubusercontent.com/johnpfeiffer/favorites/refs/heads/main/content";

const REMOTE_FILES = [
  "ai.json",
  "business.json",
  "engineering.json",
  "history.json",
  "people.json",
];

let loadPromise = null;

function pushLinksFromJson(rawLinks, data, label) {
  if (Array.isArray(data)) {
    rawLinks.push(...data);
    return;
  }

  if (data && typeof data === "object") {
    Object.values(data).forEach((value) => {
      if (Array.isArray(value)) {
        rawLinks.push(...value);
      } else {
        console.warn(`Invalid content section in ${label}`, value);
      }
    });
    return;
  }

  console.warn(`Invalid content format in ${label}`, data);
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function loadAllRemote() {
  if (!loadPromise) {
    loadPromise = (async () => {
      // Fetch all 5 in parallel; fail-fast (caught by loadAll() fallback).
      const urls = REMOTE_FILES.map((f) => `${REMOTE_BASE_URL}/${f}`);
      const results = await Promise.all(urls.map(fetchJson));

      const rawLinks = [];
      results.forEach((data, idx) => {
        pushLinksFromJson(rawLinks, data, REMOTE_FILES[idx]);
      });

      return Link.normalizeAll(rawLinks);
    })();
  }

  return loadPromise;
}

export class Link {
  constructor({ id, url, title, description, tags, createdAt, published }) {
    this.url = url;
    this.title = title;
    const resolvedDescription =
      typeof description === "string" && description.trim()
        ? description.trim()
        : title;
    this.published = published ?? null;
    this.description = Link.appendPublishedYear(
      resolvedDescription,
      this.published
    );
    this.tags = tags;
    this.id = id ?? Link.createId();
    this.createdAt = createdAt ?? new Date().toISOString();
  }

  static createId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  static normalizePublished(rawPublished, link) {
    if (rawPublished === null || rawPublished === undefined) {
      return null;
    }

    if (typeof rawPublished === "string") {
      const trimmed = rawPublished.trim();
      return trimmed ? trimmed : null;
    }

    console.warn("Invalid published value; expected ISO string or null.", {
      published: rawPublished,
      link,
    });
    return null;
  }

  static extractPublishedYear(published) {
    if (typeof published !== "string") {
      return null;
    }

    const parsed = new Date(published);
    if (!Number.isNaN(parsed.valueOf())) {
      return String(parsed.getUTCFullYear());
    }

    const match = published.match(/^(\d{4})/);
    return match ? match[1] : null;
  }

  static appendPublishedYear(description, published) {
    if (typeof description !== "string") {
      return description;
    }

    const trimmed = description.trim();
    if (!trimmed) {
      return trimmed;
    }

    const year = Link.extractPublishedYear(published);
    if (!year) {
      return trimmed;
    }

    const suffix = `(${year})`;
    if (trimmed.endsWith(suffix)) {
      return trimmed;
    }

    return `${trimmed} ${suffix}`;
  }

  static normalizeTags(rawTags, link) {
    if (!Array.isArray(rawTags)) {
      return null;
    }

    const uniqueTags = new Map();
    rawTags.forEach((tagValue) => {
      const tag = tagValue instanceof Tag ? tagValue : Tag.fromLabel(tagValue);
      if (!tag) {
        console.warn("Invalid tag skipped.", { tag: tagValue, link });
        return;
      }
      if (!uniqueTags.has(tag.key)) {
        uniqueTags.set(tag.key, tag);
      }
    });

    return Array.from(uniqueTags.values());
  }

  static from(raw, { createId = Link.createId } = {}) {
    if (!raw || typeof raw !== "object") {
      console.warn("Skipping invalid link; not an object.", raw);
      return null;
    }

    const url = typeof raw.url === "string" ? raw.url.trim() : "";
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const description =
      typeof raw.description === "string" ? raw.description.trim() : "";
    const tags = Link.normalizeTags(raw.tags, raw);

    if (!url || !title || !tags || tags.length === 0) {
      console.warn("Skipping invalid link; missing url, title, or tags.", raw);
      return null;
    }

    const rawId =
      typeof raw.id === "string" || typeof raw.id === "number"
        ? String(raw.id).trim()
        : "";
    const id = rawId ? rawId : createId();
    const createdAt =
      typeof raw.createdAt === "string" ? raw.createdAt : undefined;
    const published = Link.normalizePublished(raw.published, raw);

    try {
      return new Link({
        id,
        url,
        title,
        description,
        tags,
        createdAt,
        published,
      });
    } catch (error) {
      console.warn(
        "Skipping invalid link; unable to construct Link instance.",
        raw,
        error
      );
      return null;
    }
  }

  static normalizeAll(rawLinks, { createId = Link.createId } = {}) {
    const normalized = [];
    const seenIds = new Set();

    rawLinks.forEach((raw) => {
      const link = Link.from(raw, { createId });
      if (!link) return;

      if (seenIds.has(link.id)) {
        const nextId = createId();
        console.warn("Duplicate link id detected. Generated a new id.", {
          id: link.id,
          nextId,
        });
        link.id = nextId;
      }

      seenIds.add(link.id);
      normalized.push(link);
    });

    return normalized;
  }

  static async loadAll() {
    // Remote first, fallback to bundled JSON.
    try {
      return await loadAllRemote();
    } catch (e) {
      console.warn("Remote content failed; falling back to bundled JSON.", e);
    }

    const contentModules = import.meta.glob("/src/content/*.json");
    const modules = await Promise.all(
      Object.entries(contentModules).map(async ([path, loader]) => {
        try {
          const module = await loader();
          return { path, data: module?.default ?? module };
        } catch (error) {
          console.warn(`Failed to load ${path}.`, error);
          return null;
        }
      })
    );

    const rawLinks = [];
    modules.forEach((entry) => {
      if (!entry) return;
      const { path, data } = entry;

      if (Array.isArray(data)) {
        rawLinks.push(...data);
        return;
      }

      if (data && typeof data === "object") {
        Object.values(data).forEach((value) => {
          if (Array.isArray(value)) {
            rawLinks.push(...value);
          } else {
            console.warn(`Invalid content section in ${path}.`, value);
          }
        });
        return;
      }

      console.warn(`Invalid content format in ${path}.`, data);
    });

    return Link.normalizeAll(rawLinks);
  }
}