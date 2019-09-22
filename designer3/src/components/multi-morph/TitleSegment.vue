<template>
  <v-row>
    <v-col>
      <TitleEditor v-model="fields" />
    </v-col>
    <v-col>
      <Preview mode="markdown" :content="asMarkdown" />
    </v-col>
    <v-col>
      <Preview mode="text" :content="asLaTeX" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

import Preview from "@/components/multi-morph/Preview.vue";
import TitleEditor from "@/components/multi-morph/TitleEditor.vue";

function latexHelper(cmd: string, arg: string) {
  return `\\${cmd}{${arg}}`;
}

export default Vue.extend({
  name: "TitleSegment",

  components: {
    TitleEditor,
    Preview
  },

  data() {
    return {
      fields: {
        title: "",
        subtitle: "",
        author: "",
        date: ""
      }
    };
  },

  computed: {
    asMarkdown(): string {
      return [
        `# ${this.fields.title}`,
        `## ${this.fields.subtitle}`,
        `** ${this.fields.author} (${this.fields.date}) **`
      ].join("\n");
    },

    asLaTeX(): string {
      return [
        latexHelper("title", this.fields.title),
        latexHelper("subtitle", this.fields.subtitle),
        latexHelper("author", this.fields.author),
        latexHelper("date", this.fields.date)
      ].join("\n");
    }
  }
});
</script>
