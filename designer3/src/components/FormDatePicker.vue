<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        :label="label"
        :value="chosenDate"
        prepend-icon="mdi-calendar"
      />
    </template>
    <v-date-picker v-model="chosenDate" reactive v-on:input="clickedADate" />
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FormDatePicker",
  props: {
    label: String,
    value: String
  },
  data() {
    return {
      chosenDate: ""
    };
  },
  methods: {
    clickedADate(arg: any) {
      console.log("CLICK ARG", arg);
      this.$emit("input", arg);
    }
  },
  watch: {
    value() {
      this.chosenDate = this.value;
    }
  }
});
</script>
