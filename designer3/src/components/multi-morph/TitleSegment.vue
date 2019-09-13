<template>
  <v-container>
    <v-row>
      <v-col>
        <TitleEditor title="Editor" />
      </v-col>
      <v-col>
        <Preview mode="markdown" :content="asMarkdown" />
      </v-col>
      <v-col>
        <Preview mode="text" :content="asLaTeX" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import Preview from "@/components/multi-morph/Preview.vue";
import TitleEditor from "@/components/multi-morph/TitleEditor.vue";

import { heading, paragraph, root, strong, text } from "mdast-builder";
import stringify from "remark-stringify";
import unified from "unified";

function getSomeMarkdown(state: any): string {
  const processor = unified().use(stringify, {
    bullet: "-",
    fence: "`",
    fences: true,
    incrementListMarker: false
  });

  const output = processor.stringify(
    root([
      heading(1, text(state.title)),
      heading(2, text(state.subtitle)),
      paragraph(strong(text(state.author))),
      paragraph(strong(text(state.date)))
    ])
  );
  return output;
}

export default Vue.extend({
  components: {
    TitleEditor,
    Preview
  },

  computed: {
    asMarkdown(): string {
      return getSomeMarkdown(this.$store.state);
    },

    asLaTeX(): string {
      return "LaTeX";
    },

    content() {
      return this.$store.state;
    }
  }
});
</script>
