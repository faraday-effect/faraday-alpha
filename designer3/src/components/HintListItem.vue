<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon color="info">mdi-information</v-icon>
    </v-list-item-icon>
    <slot />
  </v-list-item>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HintListItem"
});
</script>
