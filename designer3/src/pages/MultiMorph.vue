<template>
  <v-container>
    <splitpanes horizontal class="default-theme">
      <TitleSegment />
      <MarkdownSegment />
    </splitpanes>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Splitpanes from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import MarkdownSegment from "@/components/multi-morph/MarkdownSegment.vue";
import TitleSegment from "@/components/multi-morph/TitleSegment.vue";

export default Vue.extend({
  components: {
    TitleSegment,
    MarkdownSegment,
    Splitpanes
  }
});
</script>
