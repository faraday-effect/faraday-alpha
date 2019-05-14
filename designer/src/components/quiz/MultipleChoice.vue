<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" :options="details.choices" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MultipleChoice",
  props: { details: Object },
  data() {
    return {
      response: null
    };
  }
});
</script>
