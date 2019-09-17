import {ColumnAlignment} from "@/store/table-segment.store"; import
{ColumnAlignment} from "@/store/table-segment.store"; import {ColumnAlignment}
from "@/store/table-segment.store";
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
import { ColumnAlignment, ColumnHeader } from "@/store/table-segment.store";

export default Vue.extend({
  components: {
    QuickTable,
    Preview
  },

  computed: {
    tableRows(): string[][] {
      return this.$store.state.tableSegment.tableRows;
    },

    headerRow(): ColumnHeader[] {
      return this.$store.state.tableSegment.headerRow;
    },

    asGithubFlavoredMarkdown(): string {
      const headers = this.headerRow;
      const lines = [
        headers.map(header => header.value).join(" | "),
        headers.map(header => this.makeSeparator(header)).join(" | ")
      ];
      this.tableRows.forEach(row => lines.push(row.join(" | ")));
      return lines.map(line => `| ${line} |`).join("\n");
    }
  },

  methods: {
    makeSeparator(header: ColumnHeader): string {
      const leftDecorator =
        header.alignment === ColumnAlignment.ALIGN_LEFT ||
        header.alignment === ColumnAlignment.ALIGN_CENTER
          ? ":"
          : "";
      const rightDecorator =
        header.alignment === ColumnAlignment.ALIGN_CENTER ||
        header.alignment === ColumnAlignment.ALIGN_RIGHT
          ? ":"
          : "";
      return `${leftDecorator}---${rightDecorator}`;
    }
  }
});
</script>
