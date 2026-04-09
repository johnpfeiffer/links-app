export function isTagEnabled(enabledTags, tag) {
  if (!tag || !tag.key) return false;
  return enabledTags.some((enabledTag) => enabledTag.key === tag.key);
}

export function buildTagsPath(app, tags) {
  const segments = [];
  const trimmedApp = String(app ?? "").trim().toLowerCase();

  if (trimmedApp) {
    segments.push(trimmedApp);
  }

  tags.forEach((tag) => {
    if (!tag || !tag.key) return;
    segments.push(encodeURIComponent(tag.key));
  });

  return `/${segments.join("/")}`;
}

export function buildTagTogglePath(app, enabledTags, tag) {
  const currentTags = Array.isArray(enabledTags) ? enabledTags : [];
  if (!tag || !tag.key) return buildTagsPath(app, currentTags);

  const isEnabled = isTagEnabled(currentTags, tag);
  const nextTags = isEnabled
    ? currentTags.filter((enabledTag) => enabledTag?.key !== tag.key)
    : [...currentTags, tag];

  return buildTagsPath(app, nextTags);
}
