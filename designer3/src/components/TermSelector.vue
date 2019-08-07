<template>
  <v-layout justify-space-around row>
    <v-flex sm12 md6>
      <v-select
        label="Choose a term"
        :items="selections"
        :loading="isLoading"
        v-model="selectedTermId"
        @change="onTermChanged"
      >
        <template v-slot:append-outer>
          <TermSettings />
        </template>
      </v-select>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { DateTime } from "luxon";
import TermSettings from "@/components/TermSettings.vue";
import {ALL_TERMS_QUERY} from "@/graphql/calendar.graphql";

interface TermsGql {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface Selection {
  text: string;
  value: number;
}

/**
 * Return the ID of the term nearest the current date.
 *
 * @param terms - list of terms from GraphQL
 */
function idOfNearestTerm(terms: TermsGql[]) {
  interface TermDates {
    id: number;
    startDate: DateTime;
    endDate: DateTime;
  }

  // Map date strings from GQL to Luxon objects.
  const termDates: TermDates[] = terms.map(term => ({
    id: term.id,
    startDate: DateTime.fromISO(term.startDate),
    endDate: DateTime.fromISO(term.endDate)
  }));

  // It's today!
  const today = DateTime.local();

  // If we're in any of the known terms, return that one.
  for (let term of termDates) {
    if (today >= term.startDate && today <= term.endDate) {
      console.log("In term", term.id);
      return term.id;
    }
  }

  // We're not in a term; look for the one we're closest to.
  let nearestTerm: number = -1;
  let smallestDelta: number = Infinity;
  for (let term of termDates) {
    const delta = Math.min(
      Math.abs(today.diff(term.startDate).as("days")),
      Math.abs(today.diff(term.endDate).as("days"))
    );
    if (delta < smallestDelta) {
      nearestTerm = term.id;
      smallestDelta = delta;
    }
  }
  return nearestTerm;
}

export default Vue.extend({
  name: "TermSelector",
  components: { TermSettings },
  apollo: {
    terms: {
      query: ALL_TERMS_QUERY,
      result() {
        this.isLoading = false;
        this.selectedTermId = idOfNearestTerm(this.terms);
        this.onTermChanged();
      }
    }
  },
  data() {
    const defaultTerms: TermsGql[] = [
      { id: 0, name: "", startDate: "", endDate: "" }
    ];
    return {
      isLoading: true,
      terms: defaultTerms,
      selectedTermId: -1
    };
  },
  computed: {
    selections(): Selection[] {
      return this.terms.map(term => ({
        text: term.name,
        value: term.id
      }));
    }
  },
  methods: {
    onTermChanged() {
      this.$emit("term-changed", this.selectedTermId);
    }
  }
});
</script>
