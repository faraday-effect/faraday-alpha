<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" :options="choices" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
class TrueFalseComponent extends Vue {
  choices: [{ label: "True"; value: true }, { label: "False"; value: false }];
  response: null;
}
</script>
