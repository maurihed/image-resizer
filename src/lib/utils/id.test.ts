import { describe, expect, it } from "vitest";
import { createId } from "@/lib/utils/id";

describe("createId", () => {
  it("returns a string with the given prefix", () => {
    const id = createId("test");
    expect(id).toMatch(/^test_/);
  });

  it("returns unique values", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(createId("xxx"));
    }
    expect(ids.size).toBe(100);
  });

  it("defaults prefix to 'id'", () => {
    expect(createId()).toMatch(/^id_/);
  });
});
