<template>
  <v-container>
    <v-row><TitleSegment /></v-row>
    <v-row>
      <v-col>
        <TitleEditor v-model="t1" />
        {{ t1 }}
      </v-col>
      <v-col>
        <TitleEditor v-model="t2" />
        {{ t2 }}
      </v-col>
    </v-row>
    <v-row>
      <v-col><QuickTable /></v-col>
      <v-col><QuickTable /></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import TitleEditor from "@/components/multi-morph/TitleEditor.vue";
import QuickTable from "@/components/multi-morph/QuickTable.vue";
import { TitleFields } from "@/components/multi-morph/muti-morph.types";
import TitleSegment from "@/components/multi-morph/TitleSegment.vue";

export default Vue.extend({
  components: {
    TitleSegment,
    TitleEditor,
    QuickTable
  },

  data() {
    return {
      t1: {
        title: "Fred",
        subtitle: "",
        author: "",
        date: ""
      } as TitleFields,
      t2: {
        title: "",
        subtitle: "",
        author: "Zelda",
        date: ""
      } as TitleFields
    };
  }
});
</script>
