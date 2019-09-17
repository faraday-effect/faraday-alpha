<template>
  <v-container>
    <TermSelector @term-changed="onTermChanged" />
    <v-layout>
      <v-flex>
        <v-progress-circular
          v-if="$apollo.loading || !isTermIdValid"
          indeterminate
        />
        <div v-else>
          <h1>{{ term.name }}</h1>
          <v-sheet height="2000">
            <v-calendar
              type="custom-weekly"
              :start="term.startDate.toISODate()"
              :end="term.endDate.toISODate()"
              :events="calendarEvents"
              :event-margin-bottom="3"
              :event-color="getEventColor"
            ></v-calendar>
          </v-sheet>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TermSelector from "@/components/TermSelector.vue";
import { VCalendarEvent } from "@/types/vuetify.types";
import { ONE_TERM_QUERY } from "@/graphql";
import { Term } from "@/types";
import { plainToClass } from "class-transformer";

export default Vue.extend({
  name: "Calendar",

  components: { TermSelector },

  apollo: {
    term: {
      query: ONE_TERM_QUERY,
      variables(): object {
        // Make query reactive per term id.
        return {
          termId: this.selectedTermId
        };
      },
      update(data) {
        return plainToClass(Term, data.term);
      },
      skip(): boolean {
        // Don't run query unless we have a valid term.
        return !this.isTermIdValid;
      }
    }
  },

  data: function() {
    return {
      term: {} as Term,
      selectedTermId: NaN
    };
  },

  computed: {
    calendarEvents: function(): VCalendarEvent[] {
      const events = this.term.dateRanges.map(dateRange =>
        dateRange.asVCalendarEvent()
      );

      events.push({
        name: "Semester start",
        start: this.term.startDate.toISODate(),
        end: this.term.startDate.toISODate(),
        color: "green"
      });

      events.push({
        name: "Semester end",
        start: this.term.endDate.toISODate(),
        end: this.term.endDate.toISODate(),
        color: "red"
      });

      return events;
    },

    // Do we have a valid term?
    isTermIdValid(): boolean {
      return this.selectedTermId >= 1;
    }
  },

  methods: {
    getEventColor(event: VCalendarEvent) {
      return event.color || "primary";
    },

    onTermChanged(newTerm: number): void {
      this.selectedTermId = newTerm;
    }
  }
});
</script>
