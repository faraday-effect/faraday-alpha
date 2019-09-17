import { GetterTree, Module, MutationTree } from "vuex";
import { RootState } from "@/store/index";
import times from "lodash/times";
import Vue from "vue";

export enum ColumnAlignment {
  ALIGN_LEFT = "left",
  ALIGN_CENTER = "center",
  ALIGN_RIGHT = "right"
}

export interface ColumnHeader {
  alignment: ColumnAlignment;
  value: string;
}

interface TableSegmentState {
  headerRow: Array<ColumnHeader>;
  tableRows: Array<Array<string>>;
}

const state: TableSegmentState = {
  headerRow: [makeDefaultHeader(), makeDefaultHeader()],
  tableRows: [["", ""], ["", ""]]
};

export enum RowsAndColumns {
  COLUMN_LEFT,
  COLUMN_RIGHT,
  ROW_ABOVE,
  ROW_BELOW,
  REMOVE_ROW,
  REMOVE_COLUMN,
  ALIGN_LEFT,
  ALIGN_CENTER,
  ALIGN_RIGHT
}

interface RowAndColumnPayload {
  direction: RowsAndColumns;
  index: number;
}

interface SetCellPayload {
  row: number;
  column: number;
  value: string;
}

interface SetHeaderValuePayload {
  column: number;
  value: string;
}

interface SetHeaderAlignmentPayload {
  column: number;
  alignment: ColumnAlignment;
}

// Helpers

function getRowCount(state: TableSegmentState) {
  return state.tableRows.length;
}

function getColumnCount(state: TableSegmentState) {
  if (state.tableRows.length === 0) {
    return 0;
  }
  return state.tableRows[0].length;
}

function makeDefaultHeader(): ColumnHeader {
  return {
    alignment: ColumnAlignment.ALIGN_LEFT,
    value: ""
  };
}

function makeEmptyRow(state: TableSegmentState) {
  return Array(getColumnCount(state)).fill("");
}

function setCell(
  state: TableSegmentState,
  row: number,
  column: number,
  value: string = ""
) {
  Vue.set(state.tableRows[row], column, value);
}

function setHeaderValue(
  state: TableSegmentState,
  column: number,
  value: string
) {
  Vue.set(state.headerRow[column], "value", value);
}

function setHeaderAlignment(
  state: TableSegmentState,
  column: number,
  value: ColumnAlignment
) {
  Vue.set(state.headerRow[column], "alignment", value);
}

// Getters

const getters: GetterTree<TableSegmentState, RootState> = {
  rowCount: (state: TableSegmentState) => getRowCount(state),

  columnCount: (state: TableSegmentState) => {
    if (state.tableRows.length === 0) {
      return 0;
    }
    return state.tableRows[0].length;
  }
};

// Mutations

const mutations: MutationTree<TableSegmentState> = {
  setRowCount: (state, newCount: number) => {
    const currentCount = getRowCount(state);
    if (newCount < currentCount) {
      state.tableRows.splice(newCount, currentCount - newCount);
    } else if (newCount > currentCount) {
      times(newCount - currentCount, () =>
        state.tableRows.push(makeEmptyRow(state))
      );
    }
  },

  setColumnCount: (state, newCount: number) => {
    const initialColumnCount = getColumnCount(state); // Save old value; will change.
    if (newCount < initialColumnCount) {
      state.tableRows.forEach(row =>
        row.splice(newCount, initialColumnCount - newCount)
      );
      state.headerRow.splice(newCount, initialColumnCount - newCount);
    } else if (newCount > initialColumnCount) {
      times(newCount - initialColumnCount, () => {
        state.tableRows.forEach(row => row.push(""));
        state.headerRow.push(makeDefaultHeader());
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
        state.headerRow.splice(payload.index, 0, makeDefaultHeader());
        break;
      case RowsAndColumns.COLUMN_RIGHT:
        state.tableRows.forEach(row => row.splice(payload.index + 1, 0, ""));
        state.headerRow.splice(payload.index + 1, 0, makeDefaultHeader());
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

  alignColumn: (state, payload: RowAndColumnPayload) => {
    switch (payload.direction) {
      case RowsAndColumns.ALIGN_LEFT:
        setHeaderAlignment(state, payload.index, ColumnAlignment.ALIGN_LEFT);
        break;
      case RowsAndColumns.ALIGN_CENTER:
        setHeaderAlignment(state, payload.index, ColumnAlignment.ALIGN_CENTER);
        break;
      case RowsAndColumns.ALIGN_RIGHT:
        setHeaderAlignment(state, payload.index, ColumnAlignment.ALIGN_RIGHT);
        break;
      default:
        throw new Error(`Invalid direction: '${payload.direction}'`);
    }
  },

  setCell: (state, payload: SetCellPayload) =>
    setCell(state, payload.row, payload.column, payload.value),

  setHeaderValue: (state, payload: SetHeaderValuePayload) =>
    setHeaderValue(state, payload.column, payload.value),

  setHeaderAlignment: (state, payload: SetHeaderAlignmentPayload) =>
    setHeaderAlignment(state, payload.column, payload.alignment),

  clearTable: state => {
    times(getColumnCount(state), idx => setHeaderValue(state, idx, ""));
    times(getRowCount(state), row =>
      times(getColumnCount(state), col => setCell(state, row, col, ""))
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
