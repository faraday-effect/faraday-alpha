import { mount } from "@vue/test-utils";
import MultipleDropdowns from "../MultipleDropdowns";

describe("MultipleDropdowns question type", () => {
  test("sanity check", () => {
    expect(true).toBe(true);
  });

  test("load the module", () => {
    console.log(MultipleDropdowns);
  });

  test("parses an empty template", () => {
    const wrapper = mount(MultipleDropdowns);
    expect(wrapper.vm.parseTemplate("")).toHaveLength(0);
  });

  test("parses a template with no dropdowns", () => {
    const wrapper = mount(MultipleDropdowns);
    expect(wrapper.vm.parseTemplate("test me")).toEqual(["test", "me"]);
  });
});
