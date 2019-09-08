<template>
  <v-card class="my-1" :hover="true">
    <v-card-title>
      {{ unit.title }}
    </v-card-title>
    <v-card-text>
      {{ unit.description }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Unit } from "@/types";

export default Vue.extend({
  name: "UnitCard",

  props: {
    unit: {
      type: Object,
      required: true
    }
  }
});
</script>
