import { describe, it, expect } from "vitest";
import { fabItemVisibility } from "./fab-item-visibility";

describe("fabItemVisibility", () => {
  it("hides + disables interaction when closed (the regression: menu must collapse)", () => {
    const s = fabItemVisibility(false, false);
    expect(s.opacity).toBe(0);
    expect(s.pointerEvents).toBe("none");
    expect(s.transform).toBe("translateY(8px)");
  });

  it("shows + enables interaction when open", () => {
    const s = fabItemVisibility(true, false);
    expect(s.opacity).toBe(1);
    expect(s.pointerEvents).toBe("auto");
    expect(s.transform).toBe("translateY(0)");
  });

  it("animates by default", () => {
    expect(fabItemVisibility(true, false).transition).toBe(
      "opacity 180ms ease, transform 180ms ease",
    );
  });

  it("disables animation under prefers-reduced-motion", () => {
    expect(fabItemVisibility(true, true).transition).toBe("none");
    expect(fabItemVisibility(false, true).transition).toBe("none");
  });

  it("reduced-motion does not affect the open/closed gate", () => {
    expect(fabItemVisibility(false, true).opacity).toBe(0);
    expect(fabItemVisibility(false, true).pointerEvents).toBe("none");
    expect(fabItemVisibility(true, true).opacity).toBe(1);
    expect(fabItemVisibility(true, true).pointerEvents).toBe("auto");
  });
});
