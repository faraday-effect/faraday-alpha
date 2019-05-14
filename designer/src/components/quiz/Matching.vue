<template>
  <div class="q-pa-lg">
    <div
      v-for="(pair, idx) in details.pairs"
      :key="idx"
      class="row items-center justify-start"
    >
      <div class="col-2">{{ pair[0] }}</div>
      <div class="col-2 q-py-xs">
        <q-select v-model="response[idx]" outlined dense :options="choices()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Matching",
  props: { details: Object },
  data() {
    return {
      response: []
    };
  },
  methods: {
    choices() {
      return this.details.pairs.map(pair => pair[1]);
    }
  }
});
</script>
