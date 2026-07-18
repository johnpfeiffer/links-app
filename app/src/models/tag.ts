import type { TagRecord } from "../types";

export class Tag implements TagRecord {
  label: string;
  key: string;

  constructor({ label, key }: TagRecord) {
    this.label = label;
    this.key = key;
  }

  static normalizeLabel(value: unknown): string {
    if (typeof value !== "string") return "";
    const stripped = value.replace(/[^a-zA-Z0-9\s-]/g, " ");
    const spaces = stripped.replace(/-+/g, " ");
    return spaces.trim().replace(/\s+/g, " ");
  }

  static fromLabel(value: unknown): Tag | null {
    const label = Tag.normalizeLabel(value);
    if (!label) return null;
    const key = label.toLowerCase().replace(/\s+/g, "-");
    return new Tag({ label, key });
  }

  static fromSlug(value: unknown): Tag | null {
    if (typeof value !== "string") return null;
    let decoded = value;
    try {
      decoded = decodeURIComponent(value);
    } catch (error) {
      decoded = value;
    }
    const key = decoded
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, " ")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!key) return null;
    const label = key.replace(/-+/g, " ").trim();
    return new Tag({ label, key });
  }
}
