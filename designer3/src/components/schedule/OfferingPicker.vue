<template>
  <v-select
    label="Course Offering"
    :items="offeringSelections"
    @change="emitSelectedOffering"
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

  data() {
    return {
      offerings: [] as Offering[]
    };
  },

  methods: {
    emitSelectedOffering(offeringId: number) {
      const selectedOffering = this.offerings.find(
        offering => offering.id === offeringId
      );
      this.$emit("offering-selected", selectedOffering);
    }
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
