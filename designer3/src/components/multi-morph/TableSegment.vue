<template>
  <v-container>
    <v-row>
      <v-col>
        <QuickTable />
      </v-col>
      <v-col>
        <Preview mode="text" :content="tableRows" />
      </v-col>
      <v-col>
        <Preview mode="text" :content="headerRow" />
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
  },

  computed: {
    tableRows() {
      return this.$store.state.tableSegment.tableRows;
    },

    headerRow() {
      return this.$store.state.tableSegment.headerRow;
    }
  }
});
</script>
