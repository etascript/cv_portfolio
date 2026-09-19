import { describe, expect, it } from "vitest";
import { fallbackContent } from "./content";

describe("fallbackContent", () => {
  it("contains featured published projects", () => {
    expect(fallbackContent.projects.filter((project) => project.featured && project.published).length).toBeGreaterThanOrEqual(3);
  });

  it("does not use skill metrics", () => {
    const allTech = fallbackContent.technologies.flatMap((group) => group.technologies);
    expect(allTech.some((tech) => /%|stars|level/i.test(tech))).toBe(false);
  });
});
