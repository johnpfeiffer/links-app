// @vitest-environment jsdom
import React, { act } from "react";
import { describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import SourcesSection, { buildDomainStats } from "./SourcesSection.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function renderSources(links) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(<SourcesSection links={links} />);
  });

  const cleanup = async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  };

  return { container, cleanup };
}

function buildLinks(overrides = []) {
  return [
    {
      id: "1",
      title: "Newest",
      url: "https://example.com/newest",
      published: "2022-06-01",
    },
    {
      id: "2",
      title: "Oldest",
      url: "https://example.com/oldest",
      published: "2021-01-15",
    },
    {
      id: "3",
      title: "Unknown",
      url: "https://example.com/unknown",
      published: null,
    },
    ...overrides,
  ];
}

describe("buildDomainStats", () => {
  it("sorts links by published date ascending with nulls last", () => {
    const links = buildLinks([
      {
        id: "4",
        title: "Other domain",
        url: "https://other.com/one",
        published: "2020-05-01",
      },
    ]);

    const stats = buildDomainStats(links);
    const exampleStat = stats.find((stat) => stat.domain === "example.com");

    expect(exampleStat).toBeTruthy();
    expect(exampleStat?.links.map((link) => link.id)).toEqual(["2", "1", "3"]);
  });
});

describe("SourcesSection", () => {
  it("renders links in published order when expanded", async () => {
    const links = buildLinks();

    const { container, cleanup } = await renderSources(links);
    const summary = container.querySelector('[aria-expanded="false"]');
    const domainLink = summary?.querySelector('a');

    expect(summary).toBeTruthy();
    expect(domainLink?.textContent).toBe("example.com");

    await act(async () => {
      summary.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })
      );
    });

    const hrefs = Array.from(container.querySelectorAll("li a")).map((anchor) =>
      anchor.getAttribute("href")
    );

    expect(hrefs).toEqual([
      "https://example.com/oldest",
      "https://example.com/newest",
      "https://example.com/unknown",
    ]);

    await cleanup();
  });
});
