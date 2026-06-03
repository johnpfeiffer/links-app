// @vitest-environment jsdom
import React, { act } from "react";
import { describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import SourcesPage from "./SourcesPage.jsx";
import { Tag } from "../models/tag.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const futureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const sourceLinks = [
  {
    id: "1",
    title: "Both",
    description: "Both",
    url: "https://example.com/both",
    published: "2022-06-01",
    tags: [Tag.fromLabel("AI"), Tag.fromLabel("Podcast")],
  },
  {
    id: "2",
    title: "AI only",
    description: "AI only",
    url: "https://ai.example.com/one",
    published: "2021-01-15",
    tags: [Tag.fromLabel("AI")],
  },
  {
    id: "3",
    title: "Podcast only",
    description: "Podcast only",
    url: "https://podcast.example.com/one",
    published: null,
    tags: [Tag.fromLabel("Podcast")],
  },
];

async function renderSourcesRoute(initialPath) {
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

  const router = createMemoryRouter(
    [
      {
        id: "root",
        loader: () => ({ links: sourceLinks }),
        element: <Outlet />,
        children: [
          {
            path: "sources/*",
            element: <SourcesPage />,
          },
          {
            path: ":app/sources/*",
            element: <SourcesPage />,
          },
        ],
      },
    ],
    {
      initialEntries: [initialPath],
      future: futureConfig,
    }
  );

  await act(async () => {
    root.render(<RouterProvider router={router} future={futureConfig} />);
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

describe("SourcesPage namespace integration", () => {
  it("filters Sources View membership by selected route slugs", async () => {
    const { container, cleanup } = await renderSourcesRoute("/links/sources/ai/podcast");

    expect(container.textContent).toContain("example.com");
    expect(container.textContent).not.toContain("ai.example.com");
    expect(container.textContent).not.toContain("podcast.example.com");
    expect(container.textContent).toContain("1 link");

    await cleanup();
  });

  it("preserves the application name when navigating back to Links View", async () => {
    const { container, cleanup } = await renderSourcesRoute("/links/sources/ai/podcast");
    const backLink = Array.from(container.querySelectorAll("a")).find(
      (anchor) => anchor.textContent?.trim() === "Back to home"
    );

    expect(backLink?.getAttribute("href")).toBe("/links/tags");

    await cleanup();
  });
});
