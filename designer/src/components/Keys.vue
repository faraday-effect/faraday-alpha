<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";

@Component
export default class Keys extends Vue {
  @Prop() content!: string;

  render(h: CreateElement) {
    const elts = this.content.split(/\s+/);
    return h("span", elts.map(elt => h("kbd", elt)));
  }
}
</script>

<style scoped>
/* From https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd */
kbd {
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
  color: #333;
  display: inline-block;
  font-size: 1.25em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  margin: 0 0.25em;
  white-space: nowrap;
}
</style>
