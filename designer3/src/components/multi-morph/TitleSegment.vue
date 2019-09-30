<template>
  <v-row>
    <v-col>
      <TitleEditor :value="fields" />
    </v-col>
    <v-col>
      <Preview mode="markdown" :content="asMarkdown" />
      {{ asRawData }}
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
    asRawData() {
      return this.$store.state.title.rawData;
    },

    asMarkdown(): string {
      return this.$store.state.title.markdown;
    },

    asLaTeX(): string {
      return this.$store.state.title.latex;
    }
  }
});
</script>
