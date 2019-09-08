<template>
  <v-select label="Course" :items="sectionSelections" />
</template>

<script lang="ts">
import Vue from "vue";
import { ONE_SECTION_QUERY } from "@/graphql";
import { plainToClass } from "class-transformer";
import { Section } from "@/types";
import { VSelectItem } from "@/types/vuetify.types";

export default Vue.extend({
  name: "SectionPicker",

  apollo: {
    sections: {
      query: ONE_SECTION_QUERY,
      variables() {
        return {
          sectionId: this.sectionId
        };
      },
      update(data) {
        return plainToClass(Section, data.sections);
      }
    }
  },

  props: {
    sectionId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      sections: {} as Section[]
    };
  },

  computed: {
    sectionSelections(): VSelectItem[] {
      return this.sections.map(section => ({
        text: section.descriptiveName(),
        value: section.id
      }));
    }
  }
});
</script>
