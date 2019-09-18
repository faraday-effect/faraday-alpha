<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Table Segment</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col>
          <QuickTable />
        </v-col>
        <v-col>
          <Preview mode="raw" :content="asGithubFlavoredMarkdown" />
        </v-col>
        <v-col>
          <Preview mode="raw" :content="asLaTeX" />
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";

import Preview from "@/components/multi-morph/Preview.vue";
import QuickTable from "@/components/multi-morph/QuickTable.vue";
import { ColumnAlignment, ColumnHeader } from "@/store/table-segment.store";
import times from "lodash/times";

const tabularAlignment = new Map<string, string>([
  [ColumnAlignment.ALIGN_LEFT, "l"],
  [ColumnAlignment.ALIGN_CENTER, "c"],
  [ColumnAlignment.ALIGN_RIGHT, "r"]
]);

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

    columnCount(): number {
      return this.$store.getters["tableSegment/columnCount"];
    },

    asGithubFlavoredMarkdown(): string {
      const headers = this.headerRow;
      const columnWidths = this.columnWidths();
      const lines = [
        headers
          .map((header, idx) => header.value.padStart(columnWidths[idx]))
          .join(" | "),
        headers
          .map((header, idx) =>
            this.makeSeparator(header).padEnd(columnWidths[idx])
          )
          .join(" | ")
      ];
      this.tableRows.forEach(row =>
        lines.push(
          row.map((cell, idx) => cell.padStart(columnWidths[idx])).join(" | ")
        )
      );

      return lines.map(line => `| ${line} |`).join("\n");
    },

    asLaTeX(): string {
      const headers = this.headerRow;
      const tableSpec = headers
        .map(header => tabularAlignment.get(header.alignment))
        .join("");
      const lines = [
        `\\begin{tabular}{${tableSpec}}`,
        "\\toprule",
        headers.map(header => header.value).join(" & ") + "\\\\",
        "\\midrule",
        this.tableRows.map(row => row.join(" & ") + "\\\\").join("\n"),
        "\\bottomrule",
        "\\end{tabular}"
      ];

      return lines.join("\n");
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
    },

    extractColumn(idx: number): string[] {
      return this.tableRows.map(row => row[idx]);
    },

    columnWidth(idx: number) {
      const lengths = [
        this.headerRow[idx].value.length,
        ...this.extractColumn(idx).map(cell => cell.length)
      ];
      return Math.max(...lengths);
    },

    columnWidths() {
      return times(this.columnCount, idx => this.columnWidth(idx));
    }
  }
});
</script>
