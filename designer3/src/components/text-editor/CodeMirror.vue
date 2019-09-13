<template>
  <div>
    <pane-title :title="title" />
    <textarea ref="editor" />
  </div>
</template>

<script lang="js">
// Yes, this is a JavaScript component. Code Mirror isn't especially TypeScript friendly.

import codemirror from "codemirror";
import PaneTitle from "@/components/multi-morph/PaneTitle";

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
        },
        title: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            required: true,
            validate: function (value) {
                return ["markdown"].includes(value);
            }
        },
        theme: {
            type: String,
            default: "solarized"
        }
    },

    data() {
        return {
            editor: {},
        };
    },

    mounted() {
        this.editor = codemirror.fromTextArea(this.$refs.editor, {
            mode: this.mode,
            theme: this.theme,
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
  min-height: 5em;
}
</style>
