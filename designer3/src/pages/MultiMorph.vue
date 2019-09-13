<template>
  <v-container>
    <splitpanes horizontal class="default-theme">
      <TableSegment />
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
import TableSegment from "@/components/multi-morph/TableSegment.vue";

export default Vue.extend({
  components: {
    TableSegment,
    TitleSegment,
    MarkdownSegment,
    Splitpanes
  }
});
</script>
