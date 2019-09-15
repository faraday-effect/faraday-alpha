<template>
  <v-container>
    <v-row>
      <v-col>
        <TitleEditor />
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
import { get } from "vuex-pathify";

import Preview from "@/components/multi-morph/Preview.vue";
import TitleEditor from "@/components/multi-morph/TitleEditor.vue";

function latexHelper(cmd: string, arg: string) {
  return `\\${cmd}{${arg}}`;
}

export default Vue.extend({
  components: {
    TitleEditor,
    Preview
  },

  computed: {
    asMarkdown(): string {
      return [
        `# ${this.title}`,
        `## ${this.subtitle}`,
        `** ${this.author} (${this.date}) **`
      ].join("\n");
    },

    asLaTeX(): string {
      return [
        latexHelper("title", this.title),
        latexHelper("subtitle", this.subtitle),
        latexHelper("author", this.author),
        latexHelper("date", this.date)
      ].join("\n");
    },

    title: get("titleSegment/title"),
    subtitle: get("titleSegment/subtitle"),
    author: get("titleSegment/author"),
    date: get("titleSegment/date")
  }
});
</script>
