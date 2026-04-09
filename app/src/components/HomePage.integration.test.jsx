// @vitest-environment jsdom
import React, { act } from "react";
import { describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";
import { parseUrlPath } from "../lib/parseUrlPath";
import { collectTags, filterLinksByTags } from "../models/links";
import { Link } from "../models/link";
import LinksSection from "./LinksSection";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const futureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const linkA = Link.from({
  tags: ["AI", "Podcast"],
  url: "https://a.example.com",
  title: "AI Podcast Link",
});

const linkB = Link.from({
  tags: ["AI"],
  url: "https://b.example.com",
  title: "AI Only Link",
});

const linkC = Link.from({
  tags: ["History"],
  url: "https://c.example.com",
  title: "History Link",
});

const testLinks = [linkA, linkB, linkC];

function TestHomePage() {
  const location = useLocation();
  const loaderData = useRouteLoaderData("root");
  const links = loaderData?.links ?? [];
  const { app, tags } = parseUrlPath(location.pathname);
  const allTags = collectTags(links);
  const tagByKey = new Map(allTags.map((tag) => [tag.key, tag]));
  const enabledTags = tags.map((tag) => tagByKey.get(tag.key) ?? tag);
  const filteredLinks = filterLinksByTags(links, enabledTags);

  return (
    <>
      <LinksSection app={app} links={filteredLinks} enabledTags={enabledTags} />
      <div data-testid="location">{location.pathname}</div>
    </>
  );
}

async function renderAtPath(initialPath) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const OriginalRequest = globalThis.Request;
  globalThis.Request = class TestRequest {
    constructor(input, init = {}) {
      this.url = typeof input === "string" ? input : input?.url ?? String(input);
      this.signal = init.signal;
      this.method = init.method ?? "GET";
      this.headers = init.headers ?? new Headers();
      this.body = init.body ?? null;
    }
  };

  const routes = [
    {
      id: "root",
      loader: () => ({ links: testLinks }),
      element: <Outlet />,
      children: [
        {
          path: ":app/*",
          element: <TestHomePage />,
        },
      ],
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
    future: futureConfig,
  });

  await act(async () => {
    root.render(
      <RouterProvider router={router} future={futureConfig} />
    );
  });

  const cleanup = async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    globalThis.Request = OriginalRequest;
  };

  return { container, cleanup };
}

describe("HomePage integration", () => {
  it("shows all links when no tags are in the URL path", async () => {
    const { container, cleanup } = await renderAtPath("/myapp");

    const anchors = Array.from(container.querySelectorAll('a[href]'));
    const hrefs = anchors.map((a) => a.getAttribute("href"));

    expect(hrefs).toContain("https://a.example.com");
    expect(hrefs).toContain("https://b.example.com");
    expect(hrefs).toContain("https://c.example.com");

    await cleanup();
  });

  it("filters to only matching links when tags are in the URL path", async () => {
    const { container, cleanup } = await renderAtPath("/myapp/ai");

    const anchors = Array.from(container.querySelectorAll('a[href]'));
    const hrefs = anchors.map((a) => a.getAttribute("href"));

    expect(hrefs).toContain("https://a.example.com");
    expect(hrefs).toContain("https://b.example.com");
    expect(hrefs).not.toContain("https://c.example.com");

    await cleanup();
  });

  it("filters with multiple tags (AND logic)", async () => {
    const { container, cleanup } = await renderAtPath("/myapp/ai/podcast");

    const anchors = Array.from(container.querySelectorAll('a[href]'));
    const hrefs = anchors.map((a) => a.getAttribute("href"));

    expect(hrefs).toContain("https://a.example.com");
    expect(hrefs).not.toContain("https://b.example.com");
    expect(hrefs).not.toContain("https://c.example.com");

    await cleanup();
  });

  it("shows 'No links found' when no links match", async () => {
    const { container, cleanup } = await renderAtPath("/myapp/nonexistent");

    expect(container.textContent).toContain("No links found");

    await cleanup();
  });
});
