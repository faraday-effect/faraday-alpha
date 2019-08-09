<template>
  <form v-if="value">
    <v-text-field
      label="Name"
      v-model="value.name"
      required
      prepend-icon="mdi-text"
    ></v-text-field>
    <FormDatePicker
      label="Start date"
      v-model="value.startDate"
    ></FormDatePicker>
    <FormDatePicker label="End date" v-model="value.endDate" />
  </form>
  <div v-else>No term selected.</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Term } from "./term.types";
import FormDatePicker from "./FormDatePicker.vue";

export default Vue.extend({
  name: "TermForm",
  components: { FormDatePicker },
  props: {
    value: {
      type: Object
    }
  }
});
</script>
