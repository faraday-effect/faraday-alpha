<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Markdown</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col>
          <TextEditor v-model="content" title="Markdown" mode="markdown" />
        </v-col>
        <v-col>
          <Preview mode="markdown" :content="content" />
        </v-col>
        <v-col>
          <Preview mode="text" :content="content" />
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";

import Preview from "@/components/multi-morph/Preview.vue";
import TextEditor from "@/components/text-editor";

export default Vue.extend({
  components: {
    TextEditor,
    Preview
  },

  data() {
    return {
      content: ""
    };
  }
});
</script>
