<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-layout column>
        <v-text-field
          label="Name"
          v-model="internalDateRange.title"
          required
          prepend-icon="mdi-text"
        />
        <DatePicker label="Start date" v-model="internalDateRange.startDate" />
        <DatePicker label="End date" v-model="internalDateRange.endDate" />
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import DatePicker from "./DatePicker.vue";
import { DateRange } from "@/components/term.types";

export default Vue.extend({
  name: "DateRangeEditor",

  components: {
    DatePicker
  },

  props: {
    title: {
      type: String,
      required: true
    },
    value: (null as unknown) as PropType<DateRange>
  },

  data() {
    return {
      lazyDateRange: {} as DateRange
    };
  },

  computed: {
    internalDateRange: {
      get(): DateRange {
        console.log("GET");
        return this.lazyDateRange;
      },
      set(newDateRange: DateRange): void {
        console.log("SET");
        this.lazyDateRange = newDateRange;
        this.$emit("input", this.lazyDateRange);
      }
    }
  },

  watch: {
    value: {
      handler(val: DateRange): void {
        this.lazyDateRange = new DateRange(val);
      },
      immediate: true
    }
  }
});
</script>
