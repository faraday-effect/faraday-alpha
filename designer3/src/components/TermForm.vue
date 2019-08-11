<template>
  <v-card flat>
    <v-card-title>{{ currentTerm.name }}</v-card-title>
    <v-card-text>
      <v-layout>
        <v-flex md4>
          <v-card>
            <v-card-title>Details</v-card-title>
            <v-card-text>
              <v-layout column>
                <v-text-field
                  label="Name"
                  v-model="currentTerm.name"
                  required
                  prepend-icon="mdi-text"
                />
                <FormDatePicker
                  label="Start date"
                  v-model="currentTerm.startDate"
                />
                <FormDatePicker
                  label="End date"
                  v-model="currentTerm.endDate"
                />
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="createDateRange">Add Holiday</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md8>
          <v-container grid-list-md pt-0>
            <v-layout wrap>
              <v-flex
                xs6
                v-for="(range, idx) in currentTerm.dateRanges"
                :key="idx"
              >
                <v-card>
                  <v-card-title>{{ range.title }}</v-card-title>
                  <v-card-text>
                    {{ range.startDate }}
                    <span v-if="range.endDate"> to {{ range.endDate }} </span>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn small icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn small icon @click="deleteDateRange(idx)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="submit">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import FormDatePicker from "@/components/FormDatePicker.vue";
import { DateRange, Term } from "@/components/term.types";

export default Vue.extend({
  name: "TermForm",
  components: {
    FormDatePicker
  },
  props: {
    initialTerm: Object
  },
  data() {
    return {
      currentTerm: {} as Term
    };
  },
  methods: {
    createDateRange() {
      this.currentTerm.dateRanges.push(
        new DateRange({
          title: "New Holiday",
          startDate: "2020-01-01"
        })
      );
    },
    deleteDateRange(idx: number) {
      this.currentTerm.dateRanges.splice(idx, 1);
    },
    submit() {
      this.$emit("update", this.currentTerm);
    }
  },
  watch: {
    // Update the form data when the prop changes.
    // Clone the prop object so it's not aliased within the form.
    initialTerm() {
      this.currentTerm = { ...this.initialTerm };
    }
  }
});
</script>
