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
import times from "lodash/times";

import RowMenu from "@/components/multi-morph/RowMenu.vue";
import ColumnMenu from "@/components/multi-morph/ColumnMenu.vue";
import Notification from "@/components/Notification.vue";

export default Vue.extend({
  name: "QuickTable",

  components: { RowMenu, ColumnMenu, Notification },

  data() {
    return {
      tableRows: [["", ""], ["", ""]],
      hasHeader: false,
      headerRow: ["", ""],
      snackbar: {
        visible: false,
        message: ""
      }
    };
  },

  computed: {
    rowCount: {
      get(): number {
        return this.tableRows.length;
      },
      set(newCount: number) {
        if (newCount < 1) {
          this.notify("Can't have fewer than one row");
          return;
        }
        if (newCount < this.rowCount) {
          this.tableRows.splice(newCount, this.rowCount - newCount);
        } else if (newCount > this.rowCount) {
          times(newCount - this.rowCount, () =>
            this.tableRows.push(this._emptyRow())
          );
        }
      }
    },

    columnCount: {
      get(): number {
        if (this.tableRows.length === 0) {
          return 0;
        }
        return this.tableRows[0].length;
      },
      set(newCount: number) {
        const initialColumnCount = this.columnCount; // Save old value; will change.
        if (newCount < 1) {
          this.notify("Can't have fewer than one column");
          return;
        }
        if (newCount < initialColumnCount) {
          this.tableRows.forEach(row =>
            row.splice(newCount, initialColumnCount - newCount)
          );
          this.headerRow.splice(newCount, initialColumnCount - newCount);
        } else if (newCount > initialColumnCount) {
          times(newCount - initialColumnCount, () => {
            this.tableRows.forEach(row => row.push(""));
            this.headerRow.push("");
          });
        }
      }
    }
  },

  methods: {
    // The row and colnumn values send to event handlers are zero-based.
    addLeft(column: number) {
      this.tableRows.forEach(row => row.splice(column, 0, ""));
      this.headerRow.splice(column, 0, "");
    },
    addRight(column: number) {
      this.tableRows.forEach(row => row.splice(column + 1, 0, ""));
      this.headerRow.splice(column + 1, 0, "");
    },
    removeCol(column: number) {
      this.tableRows.forEach(row => row.splice(column, 1));
      this.headerRow.splice(column, 1);
    },

    _emptyRow() {
      return Array(this.columnCount).fill("");
    },

    addAbove(row: number) {
      this.tableRows.splice(row, 0, this._emptyRow());
    },
    addBelow(row: number) {
      this.tableRows.splice(row + 1, 0, this._emptyRow());
    },
    removeRow(row: number) {
      this.tableRows.splice(row, 1);
    },

    _setCell(row: number, column: number, value = "") {
      // console.log(`(${row},${column}) = ${value}`);
      this.$set(this.tableRows[row], column, value);
    },

    _setHeader(column: number, value = "") {
      this.$set(this.headerRow, column, value);
    },

    updateCell(event: any) {
      const lostFocus = event.target;
      const [row, col] = lostFocus.id.split("-");
      const newValue = lostFocus.innerText;
      this._setCell(row, col, newValue);
    },

    updateHeader(event: any) {
      const lostFocus = event.target;
      const col = lostFocus.id;
      const newValue = lostFocus.innerText;
      this._setHeader(col, newValue);
    },

    clearTable() {
      times(this.columnCount, idx => this._setHeader(idx));
      times(this.rowCount, row =>
        times(this.columnCount, col => this._setCell(row, col))
      );
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
