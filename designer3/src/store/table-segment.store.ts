import { GetterTree, Module, MutationTree } from "vuex";
import { RootState } from "@/store/index";
import times from "lodash/times";
import Vue from "vue";

interface TableSegmentState {
  tableRows: Array<Array<string>>;
  headerRow: Array<string>;
}

const state: TableSegmentState = {
  tableRows: [["", ""], ["", ""]],
  headerRow: ["", ""]
};

export enum RowsAndColumns {
  COLUMN_LEFT,
  COLUMN_RIGHT,
  ROW_ABOVE,
  ROW_BELOW,
  REMOVE_ROW,
  REMOVE_COLUMN
}

export interface RowAndColumnPayload {
  direction: RowsAndColumns;
  index: number;
}

export interface SetCellPayload {
  row: number;
  column: number;
  value: string;
}

export interface SetHeaderPayload {
  column: number;
  value: string;
}

// Helpers

function rowCount(state: TableSegmentState) {
  return state.tableRows.length;
}

function columnCount(state: TableSegmentState) {
  if (state.tableRows.length === 0) {
    return 0;
  }
  return state.tableRows[0].length;
}

function makeEmptyRow(state: TableSegmentState) {
  return Array(columnCount(state)).fill("");
}

function setCell(
  state: TableSegmentState,
  row: number,
  column: number,
  value = ""
) {
  Vue.set(state.tableRows[row], column, value);
}

function setHeader(state: TableSegmentState, column: number, value = "") {
  Vue.set(state.headerRow, column, value);
}

const getters: GetterTree<TableSegmentState, RootState> = {
  rowCount: (state: TableSegmentState) => rowCount(state),

  columnCount: (state: TableSegmentState) => {
    if (state.tableRows.length === 0) {
      return 0;
    }
    return state.tableRows[0].length;
  }
};

const mutations: MutationTree<TableSegmentState> = {
  setRowCount: (state, newCount: number) => {
    const currentCount = rowCount(state);
    if (newCount < currentCount) {
      state.tableRows.splice(newCount, currentCount - newCount);
    } else if (newCount > currentCount) {
      times(newCount - currentCount, () =>
        state.tableRows.push(makeEmptyRow(state))
      );
    }
  },

  setColumnCount: (state, newCount: number) => {
    const initialColumnCount = columnCount(state); // Save old value; will change.
    if (newCount < initialColumnCount) {
      state.tableRows.forEach(row =>
        row.splice(newCount, initialColumnCount - newCount)
      );
      state.headerRow.splice(newCount, initialColumnCount - newCount);
    } else if (newCount > initialColumnCount) {
      times(newCount - initialColumnCount, () => {
        state.tableRows.forEach(row => row.push(""));
        state.headerRow.push("");
      });
    }
  },

  removeRowColumn: (state, payload: RowAndColumnPayload) => {
    switch (payload.direction) {
      case RowsAndColumns.REMOVE_ROW:
        state.tableRows.splice(payload.index, 1);
        break;
      case RowsAndColumns.REMOVE_COLUMN:
        state.tableRows.forEach(row => row.splice(payload.index, 1));
        state.headerRow.splice(payload.index, 1);
        break;
      default:
        throw new Error(`Invalid direction: '${payload.direction}'`);
    }
  },

  addRowColumn: (state, payload: RowAndColumnPayload) => {
    switch (payload.direction) {
      case RowsAndColumns.COLUMN_LEFT:
        state.tableRows.forEach(row => row.splice(payload.index, 0, ""));
        state.headerRow.splice(payload.index, 0, "");
        break;
      case RowsAndColumns.COLUMN_RIGHT:
        state.tableRows.forEach(row => row.splice(payload.index + 1, 0, ""));
        state.headerRow.splice(payload.index + 1, 0, "");
        break;
      case RowsAndColumns.ROW_ABOVE:
        state.tableRows.splice(payload.index, 0, makeEmptyRow(state));
        break;
      case RowsAndColumns.ROW_BELOW:
        state.tableRows.splice(payload.index + 1, 0, makeEmptyRow(state));
        break;
      default:
        throw new Error(`Invalid direction: '${payload.direction}'`);
    }
  },

  setCell: (state, payload: SetCellPayload) =>
    setCell(state, payload.row, payload.column, payload.value),

  setHeader: (state, payload: SetHeaderPayload) =>
    setHeader(state, payload.column, payload.value),

  clearTable: state => {
    times(columnCount(state), idx => setHeader(state, idx, ""));
    times(rowCount(state), row =>
      times(columnCount(state), col => setCell(state, row, col, ""))
    );
  }
};

const module: Module<TableSegmentState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations
};

export default module;
