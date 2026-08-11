import { describe, expect, it } from "vitest";
import { validateImageFile, fileToSourceImage } from "@/lib/image/load";

describe("validateImageFile", () => {
  it("accepts valid JPEG file", () => {
    const file = new File(["data"], "test.jpg", { type: "image/jpeg" });
    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("accepts valid PNG file", () => {
    const file = new File(["data"], "test.png", { type: "image/png" });
    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("rejects unsupported type", () => {
    const file = new File(["data"], "test.svg", { type: "image/svg+xml" });
    expect(() => validateImageFile(file)).toThrow("Unsupported file type");
  });

  it("rejects files over 25MB", () => {
    const largeBlob = new Blob([new ArrayBuffer(26 * 1024 * 1024)], {
      type: "image/jpeg",
    });
    const file = new File([largeBlob], "large.jpg", { type: "image/jpeg" });
    expect(() => validateImageFile(file)).toThrow("larger than 25MB");
  });
});

describe("fileToSourceImage", () => {
  it("rejects unsupported mime even if validateImageFile somehow passes", async () => {
    const file = new File(["data"], "test.svg", { type: "image/svg+xml" });
    await expect(fileToSourceImage(file)).rejects.toThrow("Unsupported file type");
  });
});
