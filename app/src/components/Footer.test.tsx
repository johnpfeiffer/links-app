// @vitest-environment jsdom
import React, { act } from "react";
import { describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import Footer from "./Footer.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function renderFooter() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(<Footer />);
  });

  const cleanup = async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  };

  return { container, cleanup };
}

describe("Footer", () => {
  it("renders the built-by line with LinkedIn and GitHub links", async () => {
    const { container, cleanup } = await renderFooter();
    expect(container.textContent).toContain("Built by John Pfeiffer");

    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(2);

    const linkedin = links[0];
    expect(linkedin.getAttribute("href")).toBe("https://www.linkedin.com/in/foupfeiffer");
    expect(linkedin.getAttribute("aria-label")).toBe("John Pfeiffer on LinkedIn");
    expect(linkedin.getAttribute("target")).toBe("_blank");
    expect(linkedin.getAttribute("rel")).toBe("noopener noreferrer");

    const github = links[1];
    expect(github.getAttribute("href")).toBe("https://github.com/johnpfeiffer/links-app");
    expect(github.getAttribute("aria-label")).toBe("Source code on GitHub");
    expect(github.getAttribute("target")).toBe("_blank");
    expect(github.getAttribute("rel")).toBe("noopener noreferrer");

    await cleanup();
  });
});
