<template>
  <div class="q-pa-lg">
    <q-input v-model="response" label="Your Answer" />
  </div>
</template>

<script lang="ts" lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "FillOneBlank",
  props: ["details"],
  data() {
    return {
      response: null
    };
  }
});
</script>
