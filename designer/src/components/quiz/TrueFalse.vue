<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" :options="choices" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

interface TrueFalseChoice {
  label: string;
  value: boolean;
}

@Component
class TrueFalseComponent extends Vue {
  choices: TrueFalseChoice[] = [
    { label: "True", value: true },
    { label: "False", value: false }
  ];
  response: TrueFalseChoice | null = null;
}
</script>
