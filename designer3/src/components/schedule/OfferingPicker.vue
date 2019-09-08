<template>
  <v-select
    label="Course"
    :items="offeringSelections"
    :value="offeringId"
    @input="$emit('input', $event.target.value"
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
    offeringId: {
      type: Number,
      required: true,
      default: NaN
    }
  },

  data() {
    return {
      offerings: [] as Offering[]
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
