<template>
  <v-dialog v-model="isOpen" width="75vw">
    <!-- Activate the dialog. -->
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
        <v-icon>mdi-settings-outline</v-icon>
      </v-btn>
    </template>
    <!-- Dialog -->
    <v-card>
      <v-card-title>
        Term Settings
        <v-spacer />
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <!-- Select a term. -->
          <v-flex xs12 md4>
            <v-list-item-group v-model="selectedTermId" mandatory>
              <v-list-item v-for="term in terms" :key="term.id">
                <v-list-item-content>
                  <v-list-item-title v-text="term.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-flex>
          <!-- Edit the selected term. -->
          <v-flex xs12 md8>
            <TermForm :initial-term="selectedTerm" @update="onUpdate" />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_TERMS_QUERY } from "@/graphql/calendar.graphql";
import TermForm from "./TermForm.vue";
import { Term } from "./term.types";

export default Vue.extend({
  name: "TermSettings",
  components: { TermForm },
  apollo: {
    terms: {
      query: ALL_TERMS_QUERY
    }
  },
  data() {
    return {
      isOpen: false,
      selectedTermId: -1,
      terms: [] as Term[]
    };
  },
  methods: {
    onUpdate(updatedTerm: Term): void {
      console.log(
        "UPDATED TERM",
        updatedTerm.name,
        updatedTerm.startDate,
        updatedTerm.endDate
      );
    }
  },
  computed: {
    selectedTerm(): Term | null {
      return this.selectedTermId >= 0 ? this.terms[this.selectedTermId] : null;
    }
  }
});
</script>
