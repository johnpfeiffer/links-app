export const CHAT_API_PATH = "/links/chat";
export const MAX_CHAT_RECOMMENDATION_ANSWERS = 2;
const WORKER_MESSAGE_LIMIT = 8_000;
const PROMPT_HEADROOM = 400;

function compactText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function wordsFor(value) {
  return compactText(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1);
}

function tagsFor(link) {
  if (!Array.isArray(link?.tags)) {
    return [];
  }

  return link.tags
    .map((tag) => compactText(tag?.label ?? tag?.key ?? tag))
    .filter(Boolean);
}

function scoreLinkForMessage(link, messageWords) {
  if (messageWords.length === 0) {
    return 0;
  }

  const haystack = wordsFor(
    [link?.title, link?.description, link?.url, tagsFor(link).join(" ")].join(" ")
  );
  const haystackSet = new Set(haystack);

  return messageWords.reduce(
    (score, word) => score + (haystackSet.has(word) ? 1 : 0),
    0
  );
}

function candidateLinksFor(message, links) {
  const messageWords = wordsFor(message);

  return [...links]
    .map((link, index) => ({
      link,
      index,
      score: scoreLinkForMessage(link, messageWords),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.index - right.index;
    })
    .map(({ link }) => link);
}

function serializeCandidate(link) {
  return JSON.stringify({
    id: compactText(link?.id),
    title: compactText(link?.title),
    description: compactText(link?.description ?? link?.title),
    url: compactText(link?.url),
    published: link?.published ?? null,
    tags: tagsFor(link),
  });
}

export function chatIsDisabled(recommendationCount) {
  return recommendationCount >= MAX_CHAT_RECOMMENDATION_ANSWERS;
}

export function buildChatPrompt({ message, links }) {
  const question = compactText(message);
  const candidates = candidateLinksFor(question, Array.isArray(links) ? links : []);
  const prefix = [
    "You recommend links from a fixed catalog.",
    "Use only candidate ids from the catalog below.",
    "Return JSON only with this shape: {\"recommendations\":[{\"linkIds\":[\"existing-id\"]}]}",
    "Do not invent links, titles, urls, ids, or tags.",
    `User request: ${question}`,
    "Catalog:",
  ].join("\n");
  const suffix = "\nReturn at most 3 recommendations.";
  const maxLength = WORKER_MESSAGE_LIMIT - PROMPT_HEADROOM;
  const lines = [];

  for (const link of candidates) {
    if (!link?.id) {
      continue;
    }

    const line = serializeCandidate(link);
    const nextPrompt = `${prefix}\n${[...lines, line].join("\n")}${suffix}`;
    if (nextPrompt.length > maxLength) {
      break;
    }
    lines.push(line);
  }

  return `${prefix}\n${lines.join("\n")}${suffix}`;
}

function parseJsonCandidate(message) {
  const text = compactText(message);
  const direct = tryParseJson(text);
  if (direct) {
    return direct;
  }

  const fenced = String(message ?? "").match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    const parsedFence = tryParseJson(fenced[1].trim());
    if (parsedFence) {
      return parsedFence;
    }
  }

  const original = String(message ?? "");
  const firstBrace = original.indexOf("{");
  const lastBrace = original.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return tryParseJson(original.slice(firstBrace, lastBrace + 1));
  }

  return null;
}

function tryParseJson(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function idsForRecommendation(recommendation) {
  if (!recommendation || typeof recommendation !== "object") {
    return [];
  }

  if (Array.isArray(recommendation.linkIds)) {
    return recommendation.linkIds;
  }

  if (typeof recommendation.linkId === "string") {
    return [recommendation.linkId];
  }

  return [];
}

export function parseChatRecommendations(message, links) {
  const data = parseJsonCandidate(message);
  const linkById = new Map(
    (Array.isArray(links) ? links : [])
      .filter((link) => typeof link?.id === "string" && link.id.trim())
      .map((link) => [link.id, link])
  );
  const rawRecommendations = Array.isArray(data?.recommendations)
    ? data.recommendations
    : [];

  return rawRecommendations
    .map((recommendation) => {
      const seen = new Set();
      const resolvedLinks = idsForRecommendation(recommendation)
        .map((id) => (typeof id === "string" ? id.trim() : ""))
        .filter((id) => {
          if (!id || seen.has(id)) {
            return false;
          }
          seen.add(id);
          return true;
        })
        .map((id) => linkById.get(id))
        .filter(Boolean);

      return {
        links: resolvedLinks,
      };
    })
    .filter((recommendation) => recommendation.links.length > 0);
}
