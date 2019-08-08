<template>
  <v-dialog v-model="isOpen" width="75vw">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
        <v-icon>mdi-settings-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Term Settings</v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 md4>
            <v-list-item-group v-model="selectedTermId">
              <v-list-item v-for="term in terms" :key="term.id">
                <v-list-item-content>
                  <v-list-item-title v-text="term.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-flex>
          <v-flex xs12 md8>
            <TermForm v-model="selectedTerm" />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="isOpen = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_TERMS_QUERY } from "@/graphql/calendar.graphql";
import TermForm from "@/components/TermForm.vue";
import { Term } from "@/components/term.types";

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
  computed: {
    selectedTerm(): Term | null {
      return this.selectedTermId >= 0 ? this.terms[this.selectedTermId] : null;
    }
  }
});
</script>
