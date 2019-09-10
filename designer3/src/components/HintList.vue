<template>
  <v-list class="elevation-1">
    <slot />
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HintList"
});
</script>
