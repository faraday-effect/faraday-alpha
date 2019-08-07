<template>
  <v-container>
    <TermSelector @term-changed="onTermChanged" />
    <v-layout>
      <v-flex>
        <v-progress-circular
          v-if="$apollo.loading || !validTermId"
          indeterminate
        ></v-progress-circular>
        <div v-else>
          <h1>{{ term.name }}</h1>
          <v-sheet height="1200">
            <v-calendar
              type="custom-weekly"
              :start="startDate"
              :end="endDate"
              :events="calendarEvents"
              event-color="primary"
            ></v-calendar>
          </v-sheet>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import gql from "graphql-tag";
import { DateTime } from "luxon";
import TermSelector from "@/components/TermSelector.vue";
import { ONE_TERM_QUERY } from "@/graphql/calendar.graphql";

interface TermGql {
  name: string;
  startDate: string;
  endDate: string;
  dateRanges: DateRangeGql[];
}

interface DateRangeGql {
  title: string;
  startDate: string;
  endDate?: string;
}

// Details of a VCalendar event.
interface CalendarEvent {
  name: string;
  start: string;
  end: string;
}

/**
 * Convert a GQL string containing an ISO date into a Luxon object.
 * @param isoString - string to convert
 */
function asIsoDate(isoString: string) {
  return DateTime.fromISO(isoString).toISODate();
}

export default Vue.extend({
  components: { TermSelector },
  apollo: {
    term: {
      query: ONE_TERM_QUERY,
      variables() {
        // Make query reactive per term id.
        return {
          termId: this.selectedTermId
        };
      },
      skip() {
        // Don't run query unless we have a valid term.
        return !this.validTermId;
      }
    }
  },
  data: function() {
    const defaultTerm: TermGql = {
      name: "",
      startDate: "",
      endDate: "",
      dateRanges: []
    };
    return {
      term: defaultTerm,
      selectedTermId: -1
    };
  },
  computed: {
    startDate(): string {
      return asIsoDate(this.term.startDate);
    },
    endDate(): string {
      return asIsoDate(this.term.endDate);
    },
    calendarEvents: function(): CalendarEvent[] {
      return this.term.dateRanges.map(dateRange => ({
        name: dateRange.title,
        start: asIsoDate(dateRange.startDate),
        end: asIsoDate(dateRange.endDate || dateRange.startDate)
      }));
    },
    // Do we have a valid term?
    validTermId(): boolean {
      return this.selectedTermId >= 1;
    }
  },
  methods: {
    onTermChanged(newTerm: number): void {
      this.selectedTermId = newTerm;
    }
  }
});
</script>
