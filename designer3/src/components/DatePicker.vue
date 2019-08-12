<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        :label="label"
        :value="internalDate"
        prepend-icon="mdi-calendar"
        readonly
      />
    </template>
    <v-date-picker reactive v-model="internalDate" />
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

// Output when clicking on blank text input ...
//   with a `v-model` in the parent component
//     SET NONE to 2019-08-14
//     EMIT 2019-08-14
//     WATCH 2019-08-14 - Change to `value` prop from `v-model` functionality
//     GET 2019-08-14
//   with no `v-model`
//     SET NONE to 2019-08-14
//     EMIT 2019-08-14
//     GET 2019-08-14

export default Vue.extend({
  name: "DatePicker",

  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      // As noted in VInput.ts, this provides a backing store should the component
      // be instantiated without a `v-model`. With neither this datum nor a `v-model`,
      // the wheels fall off completely.
      backingDate: this.value
    };
  },

  computed: {
    internalDate: {
      get(): string {
        // console.log(`GET ${this.backingDate || "NONE"}`);
        return this.backingDate;
      },
      set(newDate: string) {
        // Update the backing date in case there is no `v-model`.
        // Not needed if there is a `v-model`.
        // console.log(`SET ${this.backingDate || "NONE"} to ${newDate}`);
        this.backingDate = newDate;

        // Let the parent component know that something changed.
        // console.log(`EMIT ${this.backingDate}`);
        this.$emit("input", this.backingDate);
      }
    }
  },

  watch: {
    value(newDateProp: string) {
      // console.log(`WATCH ${newDateProp}`);
      this.backingDate = newDateProp;
    }
  }
});
</script>
