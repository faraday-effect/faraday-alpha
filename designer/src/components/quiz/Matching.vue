<template>
  <div class="q-pa-lg">
    <div
      class="row items-center justify-start"
      v-for="(pair, idx) in details.pairs"
      v-bind:key="idx"
    >
      <div class="col-2">
        {{ pair[0] }}
      </div>
      <div class="col-2 q-py-xs">
        <q-select
          outlined
          dense
          v-model="response[idx]"
          v-bind:options="choices()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "Matching",
  props: ["details"],
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
