<template>
  <form class="px-3">
    <v-layout>
      <v-flex md6>
        <v-text-field
          label="Name"
          v-model="currentTerm.name"
          required
          prepend-icon="mdi-text"
        />
        <FormDatePicker label="Start date" v-model="currentTerm.startDate" />
        <FormDatePicker label="End date" v-model="currentTerm.endDate" />
      </v-flex>
      <v-flex md6>
        <v-list>
          <v-list-item
            v-for="(range, idx) in currentTerm.dateRanges"
            :key="idx"
          >
            <v-list-item-content>
              <v-list-item-title>{{ range.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ range.startDate }}
                <span v-if="range.endDate"> - {{ range.endDate }} </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>

    <v-btn @click="onSubmit">Ok</v-btn>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import FormDatePicker from "@/components/FormDatePicker.vue";
import { Term } from "@/components/term.types";

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
    onSubmit() {
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
