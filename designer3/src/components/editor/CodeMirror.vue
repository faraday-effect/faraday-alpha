<template>
  <div>
    <pane-title title="Editor" />
    <textarea ref="editor" />
  </div>
</template>

<script lang="js">
// Yes, this is a JavaScript component. Code Mirror isn't especially TypeScript friendly.

import codemirror from "codemirror";
import PaneTitle from "@/components/PaneTitle";

import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/theme/solarized.css";
import "highlight.js/styles/solarized-light.css";

export default {
    name: "CodeMirror",

    components: {PaneTitle},

    props: {
        value: {
            type: String,
            default: ""
        }
    },

    data() {
        return {
            editor: {},
        };
    },

    mounted() {
        this.editor = codemirror.fromTextArea(this.$refs.editor, {
            mode: "markdown",
            theme: "solarized",
            lineNumbers: true
        });
        this.editor.setValue(this.value);
        this.editor.on("change", cm => {
            this.$emit('input', cm.getValue());
            this.$emit('zap', 42);
        });
    }
};
</script>

<style>
.CodeMirror {
  height: 500px;
}
</style>
