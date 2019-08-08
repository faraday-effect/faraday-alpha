interface DateRange {
  title: string;
  startDate: string;
  endDate?: string;
}

export interface Term {
  name: string;
  startDate: string;
  endDate: string;
  dateRanges: DateRange[];
}
