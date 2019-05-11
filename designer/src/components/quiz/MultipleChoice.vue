<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" v-bind:options="details.choices" />
  </div>
</template>

<script lang="ts" lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "MultipleChoice",
  props: ["details"],
  data() {
    return {
      response: null
    };
  }
});
</script>
