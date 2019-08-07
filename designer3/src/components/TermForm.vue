<template>
  <form>
    <v-text-field label="Name" v-model="term.name" required></v-text-field>
    <FormDatePicker label="Start date" v-model="term.startDate" />
    <FormDatePicker label="End date" v-model="term.endDate" />
  </form>
</template>

<script>
import Vue from "vue";
import { Term } from "./term.types";
import FormDatePicker from "@/components/FormDatePicker";

export default Vue.extend({
  name: "TermForm",
  components: { FormDatePicker },
  props: {
    value: {
      type: Term,
      required: true
    }
  },
  data() {
    return {
      term: this.value
    };
  }
});
</script>
