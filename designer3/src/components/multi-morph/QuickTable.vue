<template>
  <div>
    <table>
      <tbody>
        <tr>
          <td />
          <td v-for="col in tableRows[0].length" :key="col">
            <ColumnMenu
              :column="col"
              :columnCount="columnCount"
              @add-left="addLeft(col - 1)"
              @add-right="addRight(col - 1)"
              @remove="removeCol(col - 1)"
            />
          </td>
        </tr>
        <tr v-for="(row, rowIdx) in tableRows" :key="rowIdx">
          <td>
            <RowMenu
              :row="rowIdx"
              :rowCount="rowCount"
              @add-above="addAbove(rowIdx)"
              @add-below="addBelow(rowIdx)"
              @remove="removeRow(rowIdx)"
            />
          </td>
          <td v-for="(col, colIdx) in row" :key="colIdx">
            <div
              class="datum"
              contenteditable="true"
              v-text="col"
              style="display: inline-block"
              :id="`${rowIdx}-${colIdx}`"
              @blur="updateCell"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div>Currently {{ rowCount }} x {{ columnCount }}</div>
    <v-btn @click="clearTable">Clear</v-btn>
    <v-row>
      <v-text-field
        type="number"
        min="1"
        v-model="rowCount"
        single-line
        class="rowColText"
      />
      &times;
      <v-text-field
        type="number"
        min="1"
        v-model="columnCount"
        single-line
        class="rowColText"
      />
    </v-row>
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
import times from "lodash/times";

export default Vue.extend({
  name: "QuickTable",

  components: { RowMenu, ColumnMenu, Notification },

  data() {
    return {
      snackbar: {
        visible: false,
        message: ""
      },
      tableRows: [
        ["alpha", "beta", "gamma", "delta"],
        ["one", "two", "three", "four"]
      ]
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
        } else if (newCount > initialColumnCount) {
          times(newCount - initialColumnCount, () =>
            this.tableRows.forEach(row => row.push(""))
          );
        }
      }
    }
  },

  methods: {
    // The row and colnumn values send to event handlers are zero-based.
    addLeft(column: number) {
      this.tableRows.forEach(row => row.splice(column, 0, ""));
    },
    addRight(column: number) {
      this.tableRows.forEach(row => row.splice(column + 1, 0, ""));
    },
    removeCol(column: number) {
      this.tableRows.forEach(row => row.splice(column, 1));
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

    _setCell(row: number, column: number, newValue: string) {
      this.$set(this.tableRows[row], column, newValue);
    },

    updateCell(event: any) {
      const lostFocus = event.target;
      // const gotFocus = event.relatedTarget;

      const [row, col] = lostFocus.id.split("-");
      const newValue = lostFocus.innerText;
      this._setCell(row, col, newValue);
    },

    clearTable() {
      for (let row = 0; row < this.rowCount; row++) {
        for (let column = 0; column < this.columnCount; column++) {
          this._setCell(row, column, "");
        }
      }
    },

    notify(message: string) {
      console.log("NOTIFY", message);
      this.snackbar.message = message;
      this.snackbar.visible = true;
    }
  }
});
</script>

<style>
.datum {
  background: lightgray;
  border: thin dashed coral;
  min-height: 1em;
  min-width: 4em;
}

.rowColText {
  max-width: 60px;
}
</style>
