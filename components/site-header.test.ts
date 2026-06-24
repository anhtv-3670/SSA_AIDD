import { describe, it, expect } from "vitest";
import type { ReactElement } from "react";

import { SiteHeader } from "./site-header";

// Walk a React element tree collecting every <a> as { label, href }.
// Lets us assert nav wiring without a DOM renderer (project has no testing-library).
type AnchorInfo = { label: string; href: unknown };

function collectAnchors(node: unknown, out: AnchorInfo[]): void {
  if (node == null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((child) => collectAnchors(child, out));
    return;
  }
  const el = node as ReactElement<{ href?: unknown; children?: unknown }>;
  const props = el.props ?? {};
  if (el.type === "a") {
    const label = typeof props.children === "string" ? props.children : "";
    out.push({ label, href: props.href });
  }
  if ("children" in props) collectAnchors(props.children, out);
}

function anchorsFor(active: string): AnchorInfo[] {
  const tree = SiteHeader({ active }) as unknown;
  const anchors: AnchorInfo[] = [];
  collectAnchors(tree, anchors);
  return anchors;
}

describe("SiteHeader navigation", () => {
  it("links 'Award Information' to /he-thong-giai (regression: was stuck at '#')", () => {
    const award = anchorsFor("award").find(
      (a) => a.label === "Award Information",
    );
    expect(award).toBeDefined();
    expect(award?.href).toBe("/he-thong-giai");
  });

  it("links 'Sun* Kudos' to /sun-kudos", () => {
    const kudos = anchorsFor("award").find((a) => a.label === "Sun* Kudos");
    expect(kudos?.href).toBe("/sun-kudos");
  });

  it("never leaves a primary nav item pointing at a dead '#' anchor", () => {
    const navAnchors = anchorsFor("award").filter((a) =>
      ["About SAA 2025", "Award Information", "Sun* Kudos"].includes(a.label),
    );
    expect(navAnchors.length).toBe(3);
    expect(navAnchors.every((a) => a.href !== "#")).toBe(true);
  });
});
