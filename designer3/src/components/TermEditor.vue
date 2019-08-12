<template>
  <v-card flat>
    <v-card-title>{{ internalTerm.name }}</v-card-title>
    <v-card-text>
      <v-layout>
        <v-flex md4>
          <!-- Details -->
          <DateRangeEditor title="Details" v-model="termDetails">
            <template v-slot:actions>
              <v-spacer />
              <v-btn text @click="createDateRange">Add Holiday</v-btn>
            </template>
          </DateRangeEditor>
        </v-flex>
        <v-flex md8>
          <!-- Holidays -->
          <v-container grid-list-md pt-0>
            <v-layout wrap>
              <v-flex
                xs6
                v-for="(range, idx) in internalTerm.dateRanges"
                :key="idx"
              >
                <DateRangeEditor
                  :title="range.title"
                  v-model="internalTerm.dateRanges[idx]"
                >
                  <template v-slot:actions>
                    <v-spacer />
                    <v-btn small icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn small icon @click="deleteDateRange(idx)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </DateRangeEditor>
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
import Vue, { PropType } from "vue";
import DateRangeEditor from "@/components/DateRangeEditor.vue";
import { DateRange, Term } from "@/components/term.types";

export default Vue.extend({
  name: "TermEditor",

  components: {
    DateRangeEditor
  },

  props: {
    value: (null as unknown) as PropType<Term>
  },

  data() {
    return {
      internalTerm: {} as Term
    };
  },

  computed: {
    termDetails(): DateRange {
      return new DateRange({
        title: this.internalTerm.name,
        startDate: this.internalTerm.startDate,
        endDate: this.internalTerm.endDate
      });
    }
  },

  methods: {
    createDateRange() {
      this.internalTerm.dateRanges.push(
        new DateRange({
          title: "New Holiday",
          startDate: "2020-01-01"
        })
      );
    },
    deleteDateRange(idx: number) {
      this.internalTerm.dateRanges.splice(idx, 1);
    },
    submit() {
      this.$emit("update", this.internalTerm);
    }
  },

  watch: {
    value: {
      // Update local data when the prop changes.
      handler() {
        // Clone the prop object so it's not aliased within the form.
        this.internalTerm = new Term(this.value);
      },
      immediate: true
    }
  }
});
</script>
