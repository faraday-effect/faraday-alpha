// Details of a VCalendar event.
export interface VCalendarEvent {
  name: string;
  start: string;
  end?: string;
  color?: string;
}

// One item in a VSelect
export interface VSelectItem {
  text: string;
  value: string | number;
}
