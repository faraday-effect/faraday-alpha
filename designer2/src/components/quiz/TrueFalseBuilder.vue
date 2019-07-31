<template>
  <v-radio-group v-model="response">
    <v-radio
      v-for="(choice, idx) in choices"
      :key="idx"
      :label="choice.label"
      :value="choice.value"
    ></v-radio>
  </v-radio-group>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import QuestionBuilder from "./QuestionBuilder.vue";

@Component
export default class TrueFalseBuilder extends QuestionBuilder {
  choices = [{ label: "True", value: true }, { label: "False", value: false }];
}
</script>
