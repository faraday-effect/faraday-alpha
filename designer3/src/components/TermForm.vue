<template>
  <form class="px-3">
    <v-text-field
      label="Name"
      v-model="currentTerm.name"
      required
      prepend-icon="mdi-text"
    />
    <FormDatePicker label="Start date" v-model="currentTerm.startDate" />
    <FormDatePicker label="End date" v-model="currentTerm.endDate" />

    <v-btn @click="onSubmit">Ok</v-btn>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import FormDatePicker from "@/components/FormDatePicker.vue";

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
      currentTerm: {}
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
