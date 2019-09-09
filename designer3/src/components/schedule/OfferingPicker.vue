<template>
  <v-select
    label="Course"
    :items="offeringSelections"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_OFFERINGS_QUERY } from "@/graphql";
import { plainToClass } from "class-transformer";
import { Offering } from "@/types";
import { VSelectItem } from "@/types/vuetify.types";

export default Vue.extend({
  name: "OfferingPicker",

  apollo: {
    offerings: {
      query: ALL_OFFERINGS_QUERY,
      update(data) {
        return plainToClass(Offering, data.offerings);
      }
    }
  },

  props: {
    value: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      offerings: [] as Offering[],
      selection: NaN
    };
  },

  computed: {
    offeringSelections(): VSelectItem[] {
      return this.offerings.map(offering => ({
        text: `${offering.courseNumber()} - ${offering.courseTitle()}`,
        value: offering.id
      }));
    }
  }
});
</script>
