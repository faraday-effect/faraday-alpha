<template>
  <v-dialog v-model="isOpen" width="75vw">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
        <v-icon>mdi-settings-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <!-- Toolbar -->
      <v-toolbar dark extension-height="24" color="primary">
        <v-toolbar-title>Term Settings</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template v-slot:extension>
          <v-btn fab bottom left absolute @click="addBlankTerm">
            <v-icon>mdi-playlist-plus</v-icon>
          </v-btn>
        </template>
      </v-toolbar>

      <v-card-text>
        <v-layout>
          <!-- List of terms -->
          <v-flex xs12 md3>
            <v-list-item-group v-model="selectedTermId" mandatory>
              <v-subheader inset>Terms</v-subheader>
              <v-list-item v-for="term in terms" :key="term.id">
                <v-list-item-content>
                  <v-list-item-title v-text="term.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-flex>

          <!-- Form to edit term -->
          <v-flex xs12 md9>
            <TermEditor :initial-term="selectedTerm" @update="onUpdate" />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import TermEditor from "./TermEditor.vue";
import { ALL_TERMS_QUERY } from "@/graphql";
import { Term } from "@/types";

export default Vue.extend({
  name: "TermSettings",
  components: { TermEditor },
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
    addBlankTerm() {
      this.terms.push(
        new Term(/*{
          name: "Term Name",
          startDate: "",
          endDate: "",
          dateRanges: []
        }*/)
      );
      this.selectedTermId = this.terms.length - 1;
    },

    onUpdate(updatedTerm: Term): void {
      this.$set(this.terms, this.selectedTermId, updatedTerm);
    }
  },
  computed: {
    selectedTerm(): Term | null {
      return this.selectedTermId >= 0 ? this.terms[this.selectedTermId] : null;
    }
  }
});
</script>
