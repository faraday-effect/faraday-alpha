<template>
  <v-select
    label="Section"
    :items="sectionSelections"
    @change="emitSelectedSection"
    :disabled="sections.length < 1"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { VSelectItem } from "@/types/vuetify.types";
import { Section } from "@/types";

export default Vue.extend({
  name: "SectionPicker",

  props: {
    sections: {
      type: Array,
      required: true
    }
  },

  methods: {
    emitSelectedSection(sectionId: number) {
      const selectedSection = (this.sections as Section[]).find(
        section => section.id === sectionId
      );
      this.$emit("section-selected", selectedSection);
    }
  },

  computed: {
    sectionSelections(): VSelectItem[] {
      return (this.sections as Array<Section>).map(section => ({
        text: section.descriptiveName(),
        value: section.id
      }));
    }
  }
});
</script>
