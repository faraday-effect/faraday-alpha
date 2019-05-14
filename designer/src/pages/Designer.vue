<template>
  <q-page class="row q-col-gutter-sm">
    <div class="col-2">
      <div class="text-h6 text-center">Topic</div>
      <q-list separator>
        <q-item
          v-for="topic in topics"
          :key="topic.id"
          v-ripple
          clickable
          padding
        >
          <q-item-section avatar>
            <q-icon :name="`fas fa-${topic.icon}`"></q-icon>
          </q-item-section>
          <q-item-section>{{ topic.name }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="col-5">
      <div class="text-h6 text-center">Markdown Editor</div>
      <textarea ref="codemirror" />
    </div>

    <div class="col-5">
      <div class="text-h6 text-center">Preview</div>
      <Preview :content="renderedMarkdown" />
    </div>
  </q-page>
</template>

<script lang="ts">
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import format from "rehype-format";
import highlight from "rehype-highlight";
import html from "rehype-stringify";

import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/theme/solarized.css";
import "highlight.js/styles/solarized-light.css";
import Preview from "./Preview.vue";

import Vue from "vue";

export default Vue.extend({
  name: "PageIndex",
  components: { Preview },
  data() {
    return {
      text: "# Fred\n* Lives in Peru.\n* Married to Zelda.",
      topics: [
        { id: 1, icon: "file-code", name: "Promises" },
        { id: 2, icon: "check", name: "Promises Quiz" },
        { id: 3, icon: "file-code", name: "Async Await" }
      ]
    };
  },
  computed: {
    renderedMarkdown() {
      var processor = unified()
        .use(markdown)
        .use(remark2rehype)
        .use(highlight)
        .use(format)
        .use(html);

      return processor.processSync(this.text).toString();
    }
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.codemirror, {
      mode: "markdown",
      theme: "solarized",
      lineNumbers: true
    });
    this.editor.setValue(this.text);
    this.editor.on("change", cm => (this.text = cm.getValue()));
  }
});
</script>

<style>
.CodeMirror {
  /* Full screen, less tool bar and heading. */
  height: calc(100vh - 50px - 32px);
}
</style>
