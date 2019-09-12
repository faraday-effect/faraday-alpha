<template>
  <div v-html="content" />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    content: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped lang="sass">
.sassy
  color: teal
</style>
