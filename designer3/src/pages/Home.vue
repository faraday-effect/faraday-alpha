<template>
  <v-container>
    <v-row>
      <v-col><TitleEditor :segment-id="17"/></v-col>
      <v-col><TitleEditor :segment-id="42"/></v-col>
    </v-row>
    <v-row>
      <v-col><QuickTable /></v-col>
      <v-col><QuickTable /></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import TitleEditor from "@/components/multi-morph/TitleEditor.vue";
import QuickTable from "@/components/multi-morph/QuickTable.vue";

export default Vue.extend({
  components: {
    TitleEditor,
    QuickTable
  }
});
</script>
