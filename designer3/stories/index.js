import { storiesOf } from "@storybook/vue";
import MyButton from "./Button.vue";
import QuickTable from "../src/components/multi-morph/QuickTable";

storiesOf("Button", module)
  .add("with text", () => "<my-button>with text</my-button>")
  .add("with emoji", () => "<my-button>😀 😎 👍 💯</my-button>")
  .add("as a component", () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>'
  }));

storiesOf("QuickTable", module).add("basic", () => ({
  components: { QuickTable },
  template: "<quick-table/>"
}));
