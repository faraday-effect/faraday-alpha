import { mount } from "@vue/test-utils";
import MultipleDropdowns from "../MultipleDropdowns";

describe("MultipleDropdowns question", () => {
  test("sanity check", () => {
    expect(true).toBe(true);
  });

  test("load the module", () => {
    expect(MultipleDropdowns).toMatchObject({
      name: "MultipleDropdowns",
      props: ["details"]
    });
    console.log(MultipleDropdowns);
  });

  describe("with template", () => {
    test("empty", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("")).toHaveLength(0);
    });

    test("only whitespace", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("    ")).toHaveLength(0);
    });

    test("no dropdowns", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("test me")).toEqual([
        { type: "text", content: "test me" }
      ]);
    });

    test("one dropdown", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("[drop]")).toEqual([
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("text, no space, dropdown", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("alpha[drop]")).toEqual([
        { type: "text", content: "alpha" },
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("text, space, dropdown", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("alpha  [drop]")).toEqual([
        { type: "text", content: "alpha" },
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("dropdown, no space, text", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("[drop]alpha beta")).toEqual([
        { type: "dropdown", label: "drop" },
        { type: "text", content: "alpha beta" }
      ]);
    });

    test("adjacent dropdowns", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("[drip][drop]")).toEqual([
        { type: "dropdown", label: "drip" },
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("whitespace-separated ropdowns", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("[drip] [drop]")).toEqual([
        { type: "dropdown", label: "drip" },
        { type: "dropdown", label: "drop" }
      ]);
    });

    test("dropdown, text, dropdown", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(wrapper.vm.parseTemplate("[drip] alpha  beta [drop].")).toEqual([
        { type: "dropdown", label: "drip" },
        { type: "text", content: "alpha beta" },
        { type: "dropdown", label: "drop" },
        { type: "text", content: "." }
      ]);
    });

    test("complex", () => {
      const wrapper = mount(MultipleDropdowns);
      expect(
        wrapper.vm.parseTemplate("[flip]alpha[drip] beta   gamma [drop] . ")
      ).toEqual([
        { type: "dropdown", label: "flip" },
        { type: "text", content: "alpha" },
        { type: "dropdown", label: "drip" },
        { type: "text", content: "beta gamma" },
        { type: "dropdown", label: "drop" },
        { type: "text", content: "." }
      ]);
    });
  });
});
