<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-layout column>
        <v-text-field
          label="Name"
          v-model="internalTitle"
          required
          prepend-icon="mdi-text"
        />
        <DatePicker label="Start date" v-model="internalStartDate" />
        <DatePicker label="End date" v-model="internalEndDate" />
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn icon small disabled="1">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import DatePicker from "./DatePicker.vue";
import { DateRange } from "@/types";
import { DateTime } from "luxon";

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
    value: (null as any) as PropType<DateRange>
  },

  data() {
    return {
      internalTitle: "",
      internalStartDate: DateTime,
      internalEndDate: DateTime
    };
  },

  watch: {
    value: {
      handler(newRangeProp: DateRange) {
        this.internalTitle = newRangeProp.title;
        //        this.internalStartDate = newRangeProp.startDate;
        //        this.internalEndDate = newRangeProp.endDate || "";
      },
      immediate: true
    }
  }
});
</script>
