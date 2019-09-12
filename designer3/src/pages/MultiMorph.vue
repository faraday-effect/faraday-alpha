<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <codemirror v-model="text" :options="cmOptions" />
      </v-col>
      <v-col cols="6">
        <Preview class="preview" :content="renderedMarkdown" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import isEmpty from "lodash/isEmpty";

import unified, { Processor } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import format from "rehype-format";
import highlight from "rehype-highlight";
import html from "rehype-stringify";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/theme/solarized.css";
import "highlight.js/styles/solarized-light.css";

import { codemirror } from "vue-codemirror";

import Preview from "@/pages/Preview.vue";

export default Vue.extend({
  components: {
    codemirror,
    Preview
  },

  data() {
    return {
      processor: {} as Processor,

      cmOptions: {
        mode: "markdown",
        theme: "solarized",
        lineNumbers: true
      },

      text: "# Fred\n\n* Lives in Peru.\n\n* Married to Zelda."
    };
  },

  computed: {
    renderedMarkdown(): string {
      if (isEmpty(this.processor)) {
        // Processor hasn't een initialized yet. Computed properties are
        // accessed before `mounted` runs.
        return "";
      }
      return this.processor.processSync(this.text).toString();
    }
  },

  mounted() {
    this.processor = unified()
      .use(markdown)
      .use(remark2rehype)
      .use(highlight)
      .use(format)
      .use(html);
  }
});
</script>

<style lang="sass">
.CodeMirror
  height: 500px

.preview
  max-height: 500px
  overflow-y: scroll

.preview h1
  color: teal
</style>
