<template>
  <v-text-field v-model="response" label="Your Answer" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { FillOneBlankQuestion } from "./quiz.types";

@Component
export default class FillOneBlank extends Vue {
  @Prop() details!: object;

  response: Object[] = [];
}
</script>
