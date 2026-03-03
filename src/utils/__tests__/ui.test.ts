import { createClasses, generateChips } from "@/utils";

describe("createClasses UI Utils", () => {
  it("should join strings with a space when multiple arguments are provided", () => {
    expect(createClasses("btn", "mock")).toBe("btn mock");
  });

  it("should ignore undefined, null, and false values when creating class list", () => {
    const isActive = false;
    const isBig = true;
    expect(
      createClasses("box", isActive && "active", isBig && "big", undefined),
    ).toBe("box big");
  });

  it("should return an empty string when no arguments are provided", () => {
    expect(createClasses()).toBe("");
  });
});

describe("generateChips UI Utils", () => {
  it("should generate an array of objects with correct id and content", () => {
    const result = generateChips("Chip", 3);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { id: "Chip 1", content: "Chip 1" },
      { id: "Chip 2", content: "Chip 2" },
      { id: "Chip 3", content: "Chip 3" },
    ]);
  });

  it("should return an empty array when count is zero", () => {
    expect(generateChips("Chip", 0)).toEqual([]);
  });
});
