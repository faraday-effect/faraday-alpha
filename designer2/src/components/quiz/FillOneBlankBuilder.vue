<template>
  <v-text-field v-model="response" label="Your Answer" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import QuestionBuilder from "./QuestionBuilder.vue";

@Component
export default class FillOneBlankBuilder extends QuestionBuilder {
  @Prop() details!: object;

  response: Object[] = [];
}
</script>
