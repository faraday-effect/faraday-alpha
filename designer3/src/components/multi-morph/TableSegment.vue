<template>
  <v-container>
    <v-row>
      <v-col>
        <QuickTable />
      </v-col>
      <v-col>
        <Preview mode="raw" :content="asGithubFlavoredMarkdown" />
      </v-col>
      <v-col>
        <Preview mode="markdown" :content="asGithubFlavoredMarkdown" />
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
    tableRows(): string[][] {
      return this.$store.state.tableSegment.tableRows;
    },

    headerRow(): string[] {
      return this.$store.state.tableSegment.headerRow;
    },

    columnAlignment(): string[] {
      return this.$store.state.tableSegment.columnAlignment;
    },

    asGithubFlavoredMarkdown(): string {
      const lines = [
        this.headerRow.join(" | "),
        this.headerRow.map(() => ":---:").join(" | ")
      ];

      this.tableRows.forEach(row => lines.push(row.join(" | ")));
      return lines.map(line => `| ${line} |`).join("\n");
    }
  }
});
</script>
