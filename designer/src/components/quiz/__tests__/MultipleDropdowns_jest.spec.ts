import { MultipleDropdownsElement } from "../../../../../shared/types/quiz.types";
import MultipleDropdowns from "../MultipleDropdowns.vue";

describe("MultipleDropdowns question", () => {
  test("sanity check", () => {
    expect(true).toBe(true);
  });

  describe("parses template that's", () => {
    let parseTemplate: (template: string) => MultipleDropdownsElement[];

    beforeAll(() => {
      const component = new MultipleDropdowns();
      parseTemplate = (component as any).parseTemplate;
    });

    test("empty", () => {
      expect(parseTemplate("")).toHaveLength(0);
    });

    test("only whitespace", () => {
      expect(parseTemplate("    ")).toHaveLength(0);
    });

    test("no dropdowns", () => {
      expect(parseTemplate("test me")).toEqual([
        { type: "text", content: "test me" }
      ]);
    });

    test("one dropdown", () => {
      expect(parseTemplate("[drop]")).toEqual([
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("text, no space, dropdown", () => {
      expect(parseTemplate("alpha[drop]")).toEqual([
        { type: "text", content: "alpha" },
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("text, space, dropdown", () => {
      expect(parseTemplate("alpha  [drop]")).toEqual([
        { type: "text", content: "alpha" },
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("dropdown, no space, text", () => {
      expect(parseTemplate("[drop]alpha beta")).toEqual([
        { type: "dropdown", label: "drop" },
        { type: "text", content: "alpha beta" }
      ]);
    });

    test("adjacent dropdowns", () => {
      expect(parseTemplate("[drip][drop]")).toEqual([
        { type: "dropdown", label: "drip" },
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("whitespace-separated ropdowns", () => {
      expect(parseTemplate("[drip] [drop]")).toEqual([
        { type: "dropdown", label: "drip" },
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("dropdown, text, dropdown", () => {
      expect(parseTemplate("[drip] alpha  beta [drop].")).toEqual([
        { type: "dropdown", label: "drip" },
        { type: "text", content: "alpha beta" },
        { type: "dropdown", label: "drop" },
        { type: "text", content: "." }
      ]);
    });

    test("complex", () => {
      expect(parseTemplate("[flip]alpha[drip] beta   gamma [drop] . ")).toEqual(
        [
          { type: "dropdown", label: "flip" },
          { type: "text", content: "alpha" },
          { type: "dropdown", label: "drip" },
          { type: "text", content: "beta gamma" },
          { type: "dropdown", label: "drop" },
          { type: "text", content: "." }
        ]
      );
    });
  });
});
