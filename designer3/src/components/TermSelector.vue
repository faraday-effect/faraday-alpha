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
import TermSettings from "./TermSettings.vue";
import { ALL_TERMS_QUERY } from "@/graphql/calendar.graphql";
import { Term } from "@/components/term.types";

interface Selection {
  text: string;
  value: number;
}

/**
 * Return the ID of the term nearest the current date.
 *
 * @param terms - list of terms from GraphQL
 */
function idOfNearestTerm(terms: Term[]) {
  // It's today!
  const today = DateTime.local();

  // If we're in any of the known terms, return that one.
  for (let term of terms) {
    if (today >= term.startDateTime && today <= term.endDateTime) {
      console.log("In term", term.id);
      return term.id;
    }
  }

  // We're not in a term; look for the one we're closest to.
  let nearestTerm: number = -1;
  let smallestDelta: number = Infinity;
  for (let term of terms) {
    const delta = Math.min(
      Math.abs(today.diff(term.startDateTime).as("days")),
      Math.abs(today.diff(term.endDateTime).as("days"))
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
      update(data) {
        return data.terms.map((term: Term) => new Term(term));
      },
      result() {
        this.isLoading = false;
        this.selectedTermId = idOfNearestTerm(this.terms);
        this.onTermChanged();
      }
    }
  },
  data() {
    return {
      isLoading: true,
      terms: [] as Term[],
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
