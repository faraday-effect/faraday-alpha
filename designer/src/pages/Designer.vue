<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-2">
        <div class="text-h6 text-center">Topic</div>
        <q-list separator>
          <q-item
            clickable
            padding
            v-ripple
            v-for="topic in topics"
            v-bind:key="topic.id"
          >
            <q-item-section avatar>
              <q-icon v-bind:name="`fas fa-${topic.icon}`"></q-icon>
            </q-item-section>
            <q-item-section>{{ topic.name }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-5">
        <div class="text-h6 text-center">Tool</div>
        <textarea ref="codemirror" />
      </div>
      <div class="col-5">
        <div class="text-h6 text-center">Preview</div>
        <Preview v-bind:content="renderedMarkdown" />
      </div>
    </div>
  </q-page>
</template>

<script>
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
import Preview from "./Preview";

export default {
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
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.codemirror, {
      lineNumbers: true,
      theme: "solarized",
      mode: "markdown"
    });
    this.editor.setValue(this.text);
    this.editor.on("change", cm => (this.text = cm.getValue()));
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
  }
};
</script>
