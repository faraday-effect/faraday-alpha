<template>
  <div>
    <v-row align="center" justify="space-around">
      <v-text-field
        label="Rows"
        type="number"
        min="1"
        v-model="rowCount"
        class="rowColText"
      />
      <v-text-field
        label="Columns"
        type="number"
        min="1"
        v-model="columnCount"
        class="rowColText"
      />
      <v-switch label="Header" v-model="hasHeader" />
      <v-btn @click="clearTable">Clear</v-btn>
    </v-row>

    <table>
      <tbody>
        <!-- Column menus -->
        <tr>
          <td />
          <td v-for="(col, idx) in columnCount" :key="`col-menu-${idx}`">
            <ColumnMenu
              :column="idx"
              :columnCount="columnCount"
              @add-left="addLeft(idx)"
              @add-right="addRight(idx)"
              @remove="removeCol(idx)"
              @align-left="alignLeft(idx)"
              @align-center="alignCenter(idx)"
              @align-right="alignRight(idx)"
            />
          </td>
        </tr>

        <!-- Header row -->
        <tr v-if="hasHeader">
          <th />
          <th v-for="(header, idx) in headerRow" :key="`hdr-${idx}`">
            <div
              :id="idx"
              class="datum header"
              contenteditable="true"
              v-text="header"
              @blur="updateHeader"
            />
          </th>
        </tr>

        <!-- Body rows -->
        <tr v-for="(tableRow, rowIdx) in tableRows" :key="`row-${rowIdx}`">
          <td>
            <RowMenu
              :row="rowIdx"
              :rowCount="rowCount"
              @add-above="addAbove(rowIdx)"
              @add-below="addBelow(rowIdx)"
              @remove="removeRow(rowIdx)"
            />
          </td>
          <td
            v-for="(cell, cellIdx) in tableRow"
            :key="`cell-${rowIdx}-${cellIdx}`"
          >
            <div
              :id="`${rowIdx}-${cellIdx}`"
              class="datum"
              v-text="cell"
              contenteditable="true"
              @blur="updateCell"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div>{{ headerRow }}</div>
    <div>{{ tableRows }}</div>
    <Notification
      :message="snackbar.message"
      :visible.sync="snackbar.visible"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import RowMenu from "@/components/multi-morph/RowMenu.vue";
import ColumnMenu from "@/components/multi-morph/ColumnMenu.vue";
import Notification from "@/components/Notification.vue";
import { RowsAndColumns } from "@/store/table-segment.store";

export default Vue.extend({
  name: "QuickTable",

  components: { RowMenu, ColumnMenu, Notification },

  data() {
    return {
      hasHeader: false,
      snackbar: {
        visible: false,
        message: ""
      }
    };
  },

  computed: {
    tableRows() {
      return this.$store.state.tableSegment.tableRows;
    },

    headerRow() {
      return this.$store.state.tableSegment.headerRow;
    },

    rowCount: {
      get() {
        return this.$store.getters["tableSegment/rowCount"];
      },
      set(newCount: number) {
        if (newCount < 1) {
          this.notify("Can't have fewer than one row");
        } else {
          this.$store.commit("tableSegment/setRowCount", newCount);
        }
      }
    },

    columnCount: {
      get() {
        return this.$store.getters["tableSegment/columnCount"];
      },
      set(newCount: number) {
        if (newCount < 1) {
          this.notify("Can't have fewer than one column");
        } else {
          this.$store.commit("tableSegment/setColumnCount", newCount);
        }
      }
    }
  },

  methods: {
    // The row and column values send to event handlers are zero-based.
    addLeft(column: number) {
      this.$store.commit("tableSegment/addRowColumn", {
        direction: RowsAndColumns.COLUMN_LEFT,
        index: column
      });
    },
    addRight(column: number) {
      this.$store.commit("tableSegment/addRowColumn", {
        direction: RowsAndColumns.COLUMN_RIGHT,
        index: column
      });
    },
    removeCol(column: number) {
      this.$store.commit("tableSegment/removeRowColumn", {
        direction: RowsAndColumns.REMOVE_COLUMN,
        index: column
      });
    },

    alignLeft(column: number) {
      this.$store.commit("tableSegment/alignColumn", {
        direction: RowsAndColumns.ALIGN_LEFT,
        index: column
      });
    },
    alignCenter(column: number) {
      this.$store.commit("tableSegment/alignColumn", {
        direction: RowsAndColumns.ALIGN_CENTER,
        index: column
      });
    },
    alignRight(column: number) {
      this.$store.commit("tableSegment/alignColumn", {
        direction: RowsAndColumns.ALIGN_RIGHT,
        index: column
      });
    },

    addAbove(row: number) {
      this.$store.commit("tableSegment/addRowColumn", {
        direction: RowsAndColumns.ROW_ABOVE,
        index: row
      });
    },
    addBelow(row: number) {
      this.$store.commit("tableSegment/addRowColumn", {
        direction: RowsAndColumns.ROW_BELOW,
        index: row
      });
    },
    removeRow(row: number) {
      this.$store.commit("tableSegment/removeRowColumn", {
        direction: RowsAndColumns.REMOVE_ROW,
        index: row
      });
    },

    updateCell(event: any) {
      const lostFocus = event.target;
      const [row, column] = lostFocus.id.split("-");
      const value = lostFocus.innerText;
      this.$store.commit("tableSegment/setCell", {
        row,
        column,
        value
      });
    },

    updateHeader(event: any) {
      const lostFocus = event.target;
      const column = lostFocus.id;
      const value = lostFocus.innerText;
      this.$store.commit("tableSegment/setHeader", {
        column,
        value
      });
    },

    clearTable() {
      this.$store.commit("tableSegment/clearTable");
    },

    notify(message: string) {
      this.snackbar.message = message;
      this.snackbar.visible = true;
    }
  }
});
</script>

<style>
.datum {
  display: inline-block;
  background: lightgray;
  border: thin solid darkgray;
  min-height: 1em;
  min-width: 4em;
}

.header {
  background: lightskyblue;
}

.rowColText {
  max-width: 60px;
}
</style>
