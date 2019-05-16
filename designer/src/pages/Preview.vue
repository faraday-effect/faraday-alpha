<template>
  <!-- eslint-disable-next-line -->
  <div v-html="content"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Preview extends Vue {
  @Prop() content!: string;
}
</script>

<style scoped lang="stylus">
div {
  height: calc(100vh - 50px - 32px); // Full screen less toolbar and heading.
  overflow: auto;
  padding: 0.5em;
  background: whitesmoke;
}

div >>> h1, div >>> h2, div >>> h3, div >>> h4, div >>> h5, div >>> h6 {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
  color: #222;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: normal;
  text-transform: uppercase;
  text-shadow: none;
  word-wrap: break-word;
}

div >>> h1 {
  font-size: 2.5em;
  text-shadow: none;
}

div >>> h2 {
  font-size: 1.6em;
}

div >>> h3 {
  font-size: 1.3em;
}

div >>> h4 {
  font-size: 1em;
}

div >>> ol, div >>> dl, div >>> ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 0.5em;
}
</style>
