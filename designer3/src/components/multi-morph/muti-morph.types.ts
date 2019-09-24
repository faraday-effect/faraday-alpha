export interface TitleFields {
  title: string;
  subtitle: string;
  author: string;
  date: string;
}

export enum ColumnAlignment {
  ALIGN_LEFT = "left",
  ALIGN_CENTER = "center",
  ALIGN_RIGHT = "right"
}

export interface ColumnHeader {
  alignment: ColumnAlignment;
  value: string;
}

type CellDatum = string;

type TableRow = CellDatum[];

export interface TableContent {
  headerRow: ColumnHeader[];
  tableRows: TableRow[];
}
