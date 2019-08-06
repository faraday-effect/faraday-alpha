<template>
  <v-container>
    <TermSelector @term-changed="onTermChanged" />
    <v-progress-circular
      v-if="$apollo.loading || !validTermId"
      indeterminate
    ></v-progress-circular>
    <div v-else>
      <h1>{{ term.name }}</h1>
      <v-layout>
        <v-flex>
          <v-sheet height="1200">
            <v-calendar
              type="custom-weekly"
              :start="startDate"
              :end="endDate"
              :events="calendarEvents"
              event-color="primary"
            ></v-calendar>
          </v-sheet>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import gql from "graphql-tag";
import { DateTime } from "luxon";
import TermSelector from "@/components/TermSelector.vue";

interface Term {
  name: string;
  startDate: string;
  endDate: string;
  dateRanges: DateRange[];
}

interface DateRange {
  title: string;
  startDate: string;
  endDate?: string;
}

interface CalendarEvent {
  name: string;
  start: string;
  end: string;
}

function extractIsoDate(isoString: string) {
  return DateTime.fromISO(isoString).toISODate();
}

export default Vue.extend({
  components: { TermSelector },
  apollo: {
    term: {
      query: gql`
        query oneTerm($termId: Int!) {
          term(id: $termId) {
            name
            startDate
            endDate
            dateRanges {
              startDate
              endDate
              title
            }
          }
        }
      `,
      variables() {
        return {
          termId: this.selectedTermId
        };
      },
      skip() {
        return !this.validTermId;
      }
    }
  },
  data: function() {
    const defaultTerm: Term = {
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
      return extractIsoDate(this.term.startDate);
    },
    endDate(): string {
      return extractIsoDate(this.term.endDate);
    },
    calendarEvents: function(): CalendarEvent[] {
      return this.term.dateRanges.map(dateRange => ({
        name: dateRange.title,
        start: extractIsoDate(dateRange.startDate),
        end: extractIsoDate(dateRange.endDate || dateRange.startDate)
      }));
    },
    validTermId(): boolean {
      return this.selectedTermId >= 1;
    }
  },
  methods: {
    onTermChanged(newTerm: number) {
      this.selectedTermId = newTerm;
    }
  }
});
</script>
