<template>
  <v-container>
    <v-row>
      <v-col>
        <QuickTable />
      </v-col>
      <v-col>
        <Preview mode="markdown" />
      </v-col>
      <v-col>
        <Preview mode="text" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import Preview from "@/components/multi-morph/Preview.vue";
import QuickTable from "@/components/multi-morph/QuickTable.vue";

export default Vue.extend({
  components: {
    QuickTable,
    Preview
  }
});
</script>
