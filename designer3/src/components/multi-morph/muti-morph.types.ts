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

export interface TableHeader {
  alignment: ColumnAlignment;
  value: string;
}

type TableCell = string;

type TableRow = TableCell[];

export interface TableContent {
  headerRow: TableHeader[];
  tableRows: TableRow[];
}
