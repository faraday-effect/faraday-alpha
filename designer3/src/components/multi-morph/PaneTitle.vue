<template>
  <p class="text-right overline mb-1">{{ title }}</p>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PaneTitle",

  props: {
    title: {
      type: String,
      required: true
    }
  }
});
</script>
