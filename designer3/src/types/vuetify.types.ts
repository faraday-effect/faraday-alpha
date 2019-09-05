// Details of a VCalendar event.
import { DateTime } from "luxon";

export interface VCalendarEvent {
  name: string;
  start: DateTime;
  end?: DateTime;
  color?: string;
}
