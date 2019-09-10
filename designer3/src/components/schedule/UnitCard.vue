<template>
  <v-card @click="$emit('card-clicked', unit.id)" class="my-1" :hover="true">
    <v-card-title>
      <v-badge color="primary" left v-model="active">
        <template #badge>
          <v-icon dark>mdi-check</v-icon>
        </template>
        {{ unit.title }}
      </v-badge>
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
  },

  data() {
    return {
      active: false
    };
  },

  methods: {
    activate() {
      this.active = true;
    },
    deactivate() {
      this.active = false;
    }
  }
});
</script>
