interface DateRange {
  title: string;
  startDate: Date;
  endDate?: Date;
}

export interface Term {
  name: string;
  startDate: Date;
  endDate: Date;
  dateRanges: DateRange[];
}
