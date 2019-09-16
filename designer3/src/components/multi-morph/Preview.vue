<template>
  <div>
    <pane-title :title="mode" />
    <div v-if="asText" class="preview preview-text" v-text="renderedContent" />
    <div v-else class="preview preview-html" v-html="renderedContent" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { isEmpty } from "lodash";

import unified, { Processor } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import format from "rehype-format";
import highlight from "rehype-highlight";
import html from "rehype-stringify";
import PaneTitle from "@/components/multi-morph/PaneTitle.vue";

export default Vue.extend({
  components: {
    PaneTitle
  },

  props: {
    mode: {
      type: String,
      required: true,
      validator: function(value) {
        return ["text", "markdown", "raw"].includes(value);
      }
    },
    content: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      unifiedProcessor: {} as Processor
    };
  },

  computed: {
    // Are we rendering as text?
    asText(): boolean {
      return this.mode === "text";
    },

    renderedContent(): string {
      switch (this.mode) {
        case "text":
          return this.content;
        case "raw":
          return `<pre>${this.content}</pre>`;
        case "markdown":
          this.ensureUnistProcessor();
          return this.unifiedProcessor.processSync(this.content).toString();
        default:
          throw new Error(`Invalid preview mode: '${this.mode}'`);
      }
    }
  },

  methods: {
    /**
     * Make sure we have a valid processor in place. Cache it.
     */
    ensureUnistProcessor() {
      if (isEmpty(this.unifiedProcessor)) {
        this.unifiedProcessor = unified()
          .use(markdown)
          .use(remark2rehype)
          .use(highlight)
          .use(format)
          .use(html);
      }
    }
  }
});
</script>

<style scoped lang="sass">
.preview
  overflow-y: auto
  border: solid thin lightgray
  min-height: 5em
</style>
