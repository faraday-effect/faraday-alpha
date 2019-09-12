<template>
  <v-container>
    <v-row>
      <!--      <splitpanes class="default-theme" v-on:zap="console.log('zzzip')">-->
      <v-col><Editor v-model="content" title="Editor"/></v-col>
      <v-col><Preview mode="markdown" :content="content"/></v-col>
      <v-col><Preview mode="text" :content="content"/></v-col>
      <!--      </splitpanes>-->
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import Splitpanes from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import Preview from "@/pages/Preview.vue";
import Editor from "@/components/editor";

export default Vue.extend({
  components: {
    Editor,
    Preview
    // Splitpanes
  },

  data() {
    return {
      content: "Type stuff ..."
    };
  }
});
</script>
