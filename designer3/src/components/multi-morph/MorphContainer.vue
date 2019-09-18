<template>
  <v-expansion-panel class="panel">
    <v-expansion-panel-header>{{ header }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-expansion-panels multiple>
        <slot />
      </v-expansion-panels>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MorphContainer",

  props: {
    header: {
      type: String,
      required: true
    }
  }
});
</script>

<style>
.panel {
  background: teal;
}
</style>
